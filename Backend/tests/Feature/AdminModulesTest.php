<?php

use App\Models\Absence;
use App\Models\Admin;
use App\Models\ClassSession;
use App\Models\Exam;
use App\Models\Payment;
use App\Models\Teacher;
use App\Models\TeachingSubjectClasse;
use App\Models\User;

function adminToken(): string
{
    $admin = Admin::factory()->create();

    return $admin->createToken('test', ['admin'])->plainTextToken;
}

function withAdminToken()
{
    return test()->withHeaders([
        'Authorization' => 'Bearer '.adminToken(),
        'Accept' => 'application/json',
    ]);
}

it('creates, lists, shows and deletes an exam', function () {
    $tsc = TeachingSubjectClasse::factory()->create();

    $response = withAdminToken()->postJson('/api/exams', [
        'name' => 'Contrôle 1',
        'type' => 'written',
        'exam_date' => '2026-09-15',
        'teaching_subject_classe_id' => $tsc->id,
    ]);

    $response->assertStatus(201);
    $examId = $response->json('data.id');
    expect($examId)->not->toBeNull();

    withAdminToken()->getJson('/api/exams')->assertStatus(200)->assertJsonPath('meta.total', 1);
    withAdminToken()->getJson("/api/exams/{$examId}")->assertStatus(200);

    withAdminToken()->deleteJson("/api/exams/{$examId}")->assertStatus(204);
    expect(Exam::count())->toBe(0);
});

it('stores grades and aggregates a report card per subject', function () {
    $tsc = TeachingSubjectClasse::factory()->create();
    $student = User::factory()->create(['classe_id' => $tsc->classe_id]);

    $math = Exam::factory()->create(['teaching_subject_classe_id' => $tsc->id]);
    $oral = Exam::factory()->create(['teaching_subject_classe_id' => $tsc->id]);

    withAdminToken()->postJson('/api/grades', [
        'exam_id' => $math->id,
        'user_id' => $student->id,
        'note' => 12.5,
        'appreciation' => 'Bien',
    ])->assertStatus(201);

    withAdminToken()->postJson('/api/grades', [
        'exam_id' => $oral->id,
        'user_id' => $student->id,
        'note' => 15.5,
        'appreciation' => 'Très bien',
    ])->assertStatus(201);

    // Note out of the /20 scale must fail.
    withAdminToken()->postJson('/api/grades', [
        'exam_id' => $math->id,
        'user_id' => $student->id,
        'note' => 25,
        'appreciation' => 'Nope',
    ])->assertStatus(422);

    $reportCard = withAdminToken()->getJson("/api/grades/report-card/{$student->id}")
        ->assertStatus(200)
        ->json('data');

    expect($reportCard['overall_average'])->toEqual(14.0)
        ->and($reportCard['subjects'][0]['average'])->toEqual(14.0)
        ->and($reportCard['subjects'][0]['count'])->toBe(2);
});

it('marks attendance in bulk for one session and justifies absences', function () {
    $session = ClassSession::factory()->create();
    $students = User::factory()->count(2)->create(['classe_id' => $session->teachingSubjectClasse->classe_id]);

    withAdminToken()->postJson('/api/absences/bulk', [
        'class_session_id' => $session->id,
        'user_ids' => $students->pluck('id')->all(),
    ])->assertStatus(201)->assertJsonPath('data.count', 2);

    // Re-submitting the same sheet must not duplicate rows.
    withAdminToken()->postJson('/api/absences/bulk', [
        'class_session_id' => $session->id,
        'user_ids' => [$students[0]->id],
    ])->assertStatus(201);
    expect(Absence::count())->toBe(2);

    $absenceId = Absence::first()->id;

    withAdminToken()->patchJson("/api/absences/{$absenceId}/justify", ['justified' => true])
        ->assertStatus(200)
        ->assertJsonPath('data.justified', true);
});

it('lists absences filtered by class session', function () {
    $sessionA = ClassSession::factory()->create();
    $sessionB = ClassSession::factory()->create();
    Absence::factory()->create(['class_session_id' => $sessionA->id]);
    Absence::factory()->create(['class_session_id' => $sessionB->id]);

    withAdminToken()->getJson("/api/absences?class_session_id={$sessionA->id}")
        ->assertStatus(200)
        ->assertJsonPath('meta.total', 1);
});

it('records a payment for the authenticated admin and walks its workflow forward only', function () {
    $student = User::factory()->create();

    $created = withAdminToken()->postJson('/api/payments', [
        'user_id' => $student->id,
        'amount' => 1500.50,
        'date_payment' => '2026-08-21',
        'type_payment' => 'cash',
    ]);

    $created->assertStatus(201);
    $paymentId = $created->json('data.id');

    expect(Payment::find($paymentId))
        ->status->toBe('pending')
        ->amount->toBe(1500.50)
        ->and(Payment::find($paymentId)->admin_id)->toBeGreaterThan(0);

    // pending → completed is allowed.
    withAdminToken()->patchJson("/api/payments/{$paymentId}/status", ['status' => 'completed'])
        ->assertStatus(200)
        ->assertJsonPath('data.status', 'completed');

    // completed → anything is rejected.
    withAdminToken()->patchJson("/api/payments/{$paymentId}/status", ['status' => 'pending'])
        ->assertStatus(422);

    // Receipts listing with totals.
    $receipts = withAdminToken()->getJson("/api/payments/student/{$student->id}")
        ->assertStatus(200)
        ->json('data');

    expect($receipts['totals']['paid'])->toBe(1500.50)
        ->and($receipts['payments'])->toHaveCount(1);
});

it('rejects invalid amounts on payments', function () {
    $student = User::factory()->create();

    withAdminToken()->postJson('/api/payments', [
        'user_id' => $student->id,
        'amount' => 99999999.99,
        'date_payment' => '2026-08-21',
        'type_payment' => 'online',
    ])->assertStatus(201);
});

it('tracks teacher salaries per month with totals', function () {
    $teacher = Teacher::factory()->create();

    withAdminToken()->postJson('/api/salaries', [
        'teacher_id' => $teacher->id,
        'amount' => 4000,
        'month' => 8,
        'year' => 2026,
        'date_payment' => '2026-08-28',
        'status' => 'completed',
    ])->assertStatus(201);

    // Same period for the same teacher is rejected (unique constraint).
    withAdminToken()->postJson('/api/salaries', [
        'teacher_id' => $teacher->id,
        'amount' => 1000,
        'month' => 8,
        'year' => 2026,
        'date_payment' => '2026-08-28',
    ])->assertStatus(422);

    withAdminToken()->postJson('/api/salaries', [
        'teacher_id' => $teacher->id,
        'amount' => 1000,
        'month' => 9,
        'year' => 2026,
        'date_payment' => '2026-09-02',
    ])->assertStatus(201); // defaults to pending

    withAdminToken()->getJson('/api/salaries?month=9&year=2026')
        ->assertStatus(200)
        ->assertJsonCount(1, 'data');

    $monthly = withAdminToken()->getJson('/api/salaries/month/2026-08')
        ->assertStatus(200)
        ->json('data');

    expect($monthly['totals']['paid'])->toEqual(4000.0)
        ->and($monthly['totals']['count'])->toBe(1);
});
