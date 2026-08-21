<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amount' => fake()->randomFloat(2, 100, 5000),
            'date_payment' => fake()->date(),
            'type_payment' => fake()->randomElement(['cash', 'online']),
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
