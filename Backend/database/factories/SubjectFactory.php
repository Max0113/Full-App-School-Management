<?php

namespace Database\Factories;

use App\Models\Specialite;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subject>
 */
class SubjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'specialite_id' => Specialite::factory(),
            'facture' => fake()->numberBetween(100, 1000),
        ];
    }
}
