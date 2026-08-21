<?php

namespace Database\Factories;

use App\Models\Exam;
use App\Models\TeachingSubjectClasse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Exam>
 */
class ExamFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Exam '.fake()->word(),
            'type' => fake()->randomElement(['written', 'oral', 'practical']),
            'exam_date' => fake()->date(),
            'teaching_subject_classe_id' => TeachingSubjectClasse::factory(),
        ];
    }
}
