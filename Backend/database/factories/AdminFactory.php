<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<Admin>
 */
class AdminFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'firstname' => fake()->firstName(),
            'lastname' => fake()->lastName(),
            'date_of_birth' => fake()->dateTimeBetween('-70 years', '-30 years'),
            'gender' => fake()->randomElement(['m', 'f']),
            'blood_type' => fake()->randomElement(['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
            'address' => Str::limit(fake()->address(), 45),
            'phone' => fake()->unique()->numerify('##########'),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }
}
