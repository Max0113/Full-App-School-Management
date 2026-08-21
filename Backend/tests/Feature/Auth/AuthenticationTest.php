<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertStatus(200)->assertJsonStructure(['user', 'token']);
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test', ['student'])->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => "Bearer {$token}",
        'Accept' => 'application/json',
    ])->postJson('/api/logout');

    $response->assertNoContent();

    expect(DB::table('personal_access_tokens')->count())->toBe(0);
});
