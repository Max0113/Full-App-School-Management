<?php

namespace Database\Factories;

use App\Models\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Level>
 */
class LevelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement(['1ere', '2eme', '3eme', 'Tronc', '1Bac', '2Bac']).'-'.fake()->unique()->numberBetween(1, 999),
        ];
    }
}
