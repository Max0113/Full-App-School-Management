<?php

namespace Database\Factories;

use App\Models\ClassSession;
use App\Models\TeachingSubjectClasse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ClassSession>
 */
class ClassSessionFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('+1 days', '+1 month');

        return [
            'start_time' => $start,
            'end_time' => (clone $start)->modify('+2 hours'),
            'teaching_subject_classe_id' => TeachingSubjectClasse::factory(),
        ];
    }
}
