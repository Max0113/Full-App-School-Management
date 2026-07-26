<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
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
            'address' => Str::limit(fake()->address(), 45),
            'phone' => fake()->unique()->numerify('##########'),
            'gender' => fake()->randomElement(['m', 'f']),
            'blood_type' => fake()->randomElement(['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
            'student_parent_id' => \App\Models\StudentParent::factory(),
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
