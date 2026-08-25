<?php

namespace Database\Factories;

use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<Teacher>
 */
class TeacherFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'firstname' => fake()->firstName(),
            'lastname' => fake()->lastName(),
            'date_of_birth' => fake()->dateTimeBetween('-60 years', '-25 years'),
            'gender' => fake()->randomElement(['m', 'f']),
            'cin' => strtoupper(chr(rand(65, 90))) . strtoupper(chr(rand(65, 90))) . fake()->unique()->numerify('##########'),
            'address' => Str::limit(fake()->address(), 45),
            'phone' => fake()->unique()->numerify('##########'),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }
}
