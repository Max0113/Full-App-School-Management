<?php

namespace Database\Factories;

use App\Models\Classe;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeachingSubjectClasse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeachingSubjectClasse>
 */
class TeachingSubjectClasseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'teacher_id' => Teacher::factory(),
            'subject_id' => Subject::factory(),
            'classe_id' => Classe::factory(),
        ];
    }
}
