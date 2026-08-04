<?php

namespace Database\Factories;

use App\Models\Classe;
use App\Models\Level;
use App\Models\SchoolYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Classe>
 */
class ClasseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->bothify('Class ##'),
            'level_id' => Level::factory(),
            'school_year_id' => SchoolYear::factory(),
        ];
    }
}
