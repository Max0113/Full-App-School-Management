<?php

namespace Database\Factories;

use App\Models\Exam;
use App\Models\Grade;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Grade>
 */
class GradeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'exam_id' => Exam::factory(),
            'user_id' => User::factory(),
            'note' => fake()->randomFloat(2, 0, 20),
            'appreciation' => fake()->sentence(4),
        ];
    }
}
