<?php

use App\Models\Admin;
use App\Models\Classe;
use App\Models\SchoolYear;
use App\Models\StudentClasse;
use App\Models\StudentParent;
use App\Models\User;

function studentAdminToken(): string
{
    $admin = Admin::factory()->create();

    return $admin->createToken('test', ['admin'])->plainTextToken;
}

function studentRequest(array $overrides = []): array
{
    return array_merge([
        'firstname' => 'New',
        'lastname' => 'Kid',
        'date_of_birth' => '2010-01-01',
        'gender' => 'm',
        'code_masser' => 'S'.random_int(100000000, 999999999),
        'address' => '1 Rue Test',
        'phone' => '06'.random_int(10000000, 99999999),
        'email' => 'kid'.random_int(100000, 999999).'@school.test',
        'password' => 'password123',
    ], $overrides);
}

it('stores a student into the student_classes pivot and reads it back', function () {
    $schoolYear = SchoolYear::factory()->create();
    $classeA = Classe::factory()->create(['school_year_id' => $schoolYear->id]);
    $classeB = Classe::factory()->create(['school_year_id' => $schoolYear->id]);
    $parent = StudentParent::factory()->create();

    $stored = test()->withHeaders(['Authorization' => 'Bearer '.studentAdminToken(), 'Accept' => 'application/json'])
        ->postJson('/api/students', studentRequest([
            'student_parent_id' => $parent->id,
            'classe_id' => $classeA->id,
        ]));

    $stored->assertStatus(201);
    $id = $stored->json('data.id');

    $pivot = StudentClasse::where('student_id', $id)->first();
    expect($pivot)->not->toBeNull()
        ->and($pivot->classe_id)->toBe($classeA->id)
        ->and($pivot->school_year_id)->toBe($schoolYear->id);

    $listed = test()->withHeaders(['Authorization' => 'Bearer '.studentAdminToken(), 'Accept' => 'application/json'])
        ->getJson('/api/students?classe_id='.$classeB->id);
    expect($listed->json('data'))->toBeArray();

    $shown = test()->withHeaders(['Authorization' => 'Bearer '.studentAdminToken(), 'Accept' => 'application/json'])
        ->getJson("/api/students/{$id}");
    $shown->assertStatus(200)
        ->assertJsonPath('data.classe_id', $classeA->id)
        ->assertJsonPath('data.classe_name', $classeA->name);
});

it('moves a student to another class on update via the pivot', function () {
    $schoolYear = SchoolYear::factory()->create();
    $oldClasse = Classe::factory()->create(['school_year_id' => $schoolYear->id]);
    $newClasse = Classe::factory()->create(['school_year_id' => $schoolYear->id]);
    $parent = StudentParent::factory()->create();

    $student = User::factory()->create();
    StudentClasse::factory()->create([
        'student_id' => $student->id,
        'classe_id' => $oldClasse->id,
        'school_year_id' => $schoolYear->id,
    ]);

    $updated = test()->withHeaders(['Authorization' => 'Bearer '.studentAdminToken(), 'Accept' => 'application/json'])
        ->patchJson("/api/students/{$student->id}", studentRequest([
            'firstname' => 'Updated',
            'student_parent_id' => $parent->id,
            'classe_id' => $newClasse->id,
        ]));

    $updated->assertStatus(200)
        ->assertJsonPath('data.id', $student->id);

    expect(StudentClasse::where('student_id', $student->id)->count())->toBe(1)
        ->and(StudentClasse::where('student_id', $student->id)->value('classe_id'))->toBe($newClasse->id);
});

it('soft-deletes a student while keeping the pivot row', function () {
    $schoolYear = SchoolYear::factory()->create();
    $classe = Classe::factory()->create(['school_year_id' => $schoolYear->id]);
    $student = User::factory()->create();
    $pivot = StudentClasse::factory()->create([
        'student_id' => $student->id,
        'classe_id' => $classe->id,
        'school_year_id' => $schoolYear->id,
    ]);

    test()->withHeaders(['Authorization' => 'Bearer '.studentAdminToken(), 'Accept' => 'application/json'])
        ->deleteJson("/api/students/{$student->id}")
        ->assertStatus(204);

    expect(User::find($student->id))->toBeNull()
        ->and(User::withTrashed()->find($student->id))->not->toBeNull()
        ->and(StudentClasse::where('student_id', $student->id)->first()->id)->toBe($pivot->id);
});