<?php

use App\Models\Admin;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

it('registers a student with a full profile and returns a token', function () {
    $payload = [
        'firstname' => 'Ali',
        'lastname' => 'Alaoui',
        'date_of_birth' => '2008-05-10',
        'gender' => 'm',
        'blood_type' => 'O+',
        'address' => '123 Rue de l\'École',
        'phone' => '0600000001',
        'email' => 'ali@school.test',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->postJson('/api/register', $payload);

    $response->assertStatus(201);
    expect($response->json('token'))->not->toBeNull()
        ->and($response->json('user.email'))->toBe('ali@school.test');

    expect(User::where('email', 'ali@school.test')->exists())->toBeTrue();
});

it('rejects registration when the email already exists in ANY account table', function () {
    Teacher::factory()->create(['email' => 'shared@school.test']);

    $this->postJson('/api/register', [
        'firstname' => 'Sara',
        'lastname' => 'Bennani',
        'date_of_birth' => '2008-05-10',
        'gender' => 'f',
        'blood_type' => 'A+',
        'address' => '456 Avenue Hassan II',
        'phone' => '0600000002',
        'email' => 'shared@school.test',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertStatus(422)->assertJsonValidationErrors('email');
});

it('updates last_login_date on real login only', function () {
    $teacher = Teacher::factory()->create([
        'email' => 'login@school.test',
        'password' => Hash::make('password123'),
        'last_login_date' => null,
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'login@school.test',
        'password' => 'password123',
    ]);

    $response->assertStatus(200);
    expect($response->json('token'))->not->toBeNull()
        ->and($response->json('user.role'))->toBe('teacher');

    $teacher->refresh();
    expect($teacher->last_login_date?->isToday())->toBeTrue();
});

it('refuses logout without a token and revokes tokens on logout', function () {
    // No token → 401 instead of a 500 crash.
    $this->postJson('/api/logout')->assertStatus(401);

    $admin = Admin::factory()->create();
    $token = $admin->createToken('test', ['admin'])->plainTextToken;

    $this->withHeaders([
        'Authorization' => "Bearer {$token}",
        'Accept' => 'application/json',
    ])->postJson('/api/logout')->assertStatus(204);

    // Every token of the account must be revoked.
    expect($admin->tokens()->count())->toBe(0)
        ->and(DB::table('personal_access_tokens')->count())->toBe(0);
});
