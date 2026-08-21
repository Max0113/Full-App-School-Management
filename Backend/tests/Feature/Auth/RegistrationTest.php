<?php

test('new users can register', function () {
    $response = $this->postJson('/api/register', [
        'firstname' => 'Test',
        'lastname' => 'User',
        'date_of_birth' => '2008-05-10',
        'gender' => 'm',
        'blood_type' => 'O+',
        'address' => '123 Rue de l\'École',
        'phone' => '0600000042',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertStatus(201)->assertJsonStructure(['user', 'token']);
});
