<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\StudentParent;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        User::factory()->create([
            'firstname' => 'Younes',
            'lastname' => 'Amzil',
            'email' => 'amzilyouness2020@gmail.com',
            'password' => Hash::make('ufgjfuc7473y8'),
            'phone' => '0612345678',
            'date_of_birth' => '1995-01-01',
            'gender' => 'm',
        ]);

        Teacher::factory()->create([
            'firstname' => 'Teacher',
            'lastname' => 'Teacher',
            'date_of_birth' => fake()->date(),
            'address' => fake()->address(),
            'phone' => substr(fake()->phoneNumber() , 10),
            'email' => 'Teacher@Teacher.com',
            'password' => Hash::make('00001111')
        ]);

        StudentParent::factory(10)->create();

        StudentParent::factory()->create([
            'firstname' => 'Parent',
            'lastname' => 'Parent',
            'date_of_birth' => fake()->date(),
            'address' => fake()->address(),
            'phone' => substr(fake()->phoneNumber() , 10),
            'email' => 'Parent@Parent.com',
            'password' => Hash::make('00001111')
        ]);

        Admin::factory()->create([
            'firstname' => 'Admin',
            'lastname' => 'Admin',
            'date_of_birth' => fake()->date(),
            'address' => fake()->address(),
            'phone' => substr(fake()->phoneNumber() , 10),
            'email' => 'Admin@Admin.com',
            'password' => Hash::make('00001111')
        ]);
    }
}
