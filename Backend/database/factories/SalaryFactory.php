<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Salary;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Salary>
 */
class SalaryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'teacher_id' => Teacher::factory(),
            'amount' => fake()->randomFloat(2, 2000, 10000),
            'mois' => now()->format('Y-m'),
            'date_payment' => fake()->date(),
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed']),
            'admin_id' => Admin::factory(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }
}
