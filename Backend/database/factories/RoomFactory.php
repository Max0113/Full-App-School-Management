<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Room ' . $this->faker->word(),
            'capacity' => $this->faker->numberBetween(20, 100),
            'type' => $this->faker->randomElement([
                'Département Normal',
                'Département informatique',
                'Département mathématiques',
                'Département physique',
                'Département chimie',
                'Département biologie',
            ]),
            'availability' => $this->faker->boolean(80),
        ];
    }
}
