<?php

namespace Database\Factories;

use App\Models\Absence;
use App\Models\ClassSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Absence>
 */
class AbsenceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'date' => fake()->date(),
            'class_session_id' => ClassSession::factory(),
            'user_id' => User::factory(),
            'justified' => false,
        ];
    }
}
