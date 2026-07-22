<?php

namespace Database\Factories;

use App\Models\StudentParent;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<StudentParent>
 */
class StudentParentFactory extends Factory
{
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'firstname' => fake()->firstName(),
            'lastname' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'date_of_birth' => fake()->dateTimeBetween('-60 years', '-5 years'),
            'last_login_date' => fake()->dateTimeBetween('-1 month', 'now'),
            'address' => fake()->address(),
            'phone' => fake()->unique()->numerify('##########'),
            'gender' => fake()->randomElement(['m', 'f']),
            'blood_type' => fake()->randomElement(['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'])
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
