<?php

namespace Database\Factories;

use App\Models\StudentClasse;
use App\Models\User;
use App\Models\Classe;
use App\Models\SchoolYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StudentClasse>
 */
class StudentClasseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => User::inRandomOrder()->value('id') ?? User::factory(),
            'classe_id' => Classe::inRandomOrder()->value('id') ?? Classe::factory(),
            'school_year_id' => SchoolYear::inRandomOrder()->value('id') ?? SchoolYear::factory(),
        ];
    }
}
