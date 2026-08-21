<?php

namespace Database\Seeders;

use App\Models\Absence;
use App\Models\Admin;
use App\Models\Classe;
use App\Models\ClassSession;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\Level;
use App\Models\Payment;
use App\Models\Salary;
use App\Models\SchoolYear;
use App\Models\Specialite;
use App\Models\StudentParent;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeachingSubjectClasse;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed a coherent demo school — no real credentials.
     *
     * Every demo account uses the password "password".
     */
    public function run(): void
    {
        $demoPassword = Hash::make('password');

        // ------------------------------------------------------------------
        // Accounts
        // ------------------------------------------------------------------
        $admin = Admin::factory()->create([
            'firstname' => 'Demo',
            'lastname' => 'Admin',
            'email' => 'admin@school.test',
            'password' => $demoPassword,
        ]);

        $teacher = Teacher::factory()->create([
            'firstname' => 'Demo',
            'lastname' => 'Teacher',
            'email' => 'teacher@school.test',
            'password' => $demoPassword,
        ]);

        $parent = StudentParent::factory()->create([
            'firstname' => 'Demo',
            'lastname' => 'Parent',
            'email' => 'parent@school.test',
            'password' => $demoPassword,
        ]);

        // ------------------------------------------------------------------
        // School structure
        // ------------------------------------------------------------------
        $schoolYear = SchoolYear::factory()->create(['name' => '2025/2026']);

        $sciences = Specialite::factory()->create(['name' => 'Sciences Mathématiques']);
        $lettres = Specialite::factory()->create(['name' => 'Lettres']);

        $levels = collect(['Tronc Commun', '1Bac', '2Bac'])
            ->map(fn (string $name) => Level::factory()->create(['name' => $name]));

        $classes = $levels
            ->map(fn (Level $level) => Classe::factory()->create([
                'name' => $level->name.'-S',
                'level_id' => $level->id,
                'school_year_id' => $schoolYear->id,
                'specialite_id' => $sciences->id,
            ]))
            ->push(Classe::factory()->create([
                'name' => '1Bac-L',
                'level_id' => $levels[1]->id,
                'school_year_id' => $schoolYear->id,
                'specialite_id' => $lettres->id,
            ]));

        $subjects = collect([
            ['Mathématiques', $sciences],
            ['Physique-Chimie', $sciences],
            ['Anglais', $sciences],
            ['Philosophie', $lettres],
        ])->map(fn (array $pair) => Subject::factory()->create([
            'name' => $pair[0],
            'specialite_id' => $pair[1]->id,
        ]));

        // ------------------------------------------------------------------
        // Teaching assignments + weekly timetable
        // ------------------------------------------------------------------
        $extraTeachers = Teacher::factory()->count(2)->create();

        $assignments = collect();
        foreach ($classes as $index => $classe) {
            // The demo teacher teaches Math everywhere; extras cover the rest.
            $assignments->push(TeachingSubjectClasse::factory()->create([
                'teacher_id' => $teacher->id,
                'subject_id' => $subjects[0]->id,
                'classe_id' => $classe->id,
            ]));

            $otherSubjects = $subjects->slice(1);
            if ($classe->specialite_id === $lettres->id) {
                $otherSubjects = $subjects->slice(3);
            }

            foreach ($otherSubjects as $i => $subject) {
                $assignments->push(TeachingSubjectClasse::factory()->create([
                    'teacher_id' => $extraTeachers[$i % $extraTeachers->count()]->id,
                    'subject_id' => $subject->id,
                    'classe_id' => $classe->id,
                ]));
            }
        }

        $slots = [
            ['08:00', '10:00'],
            ['10:30', '12:30'],
            ['14:00', '16:00'],
        ];

        $assignments->each(function (TeachingSubjectClasse $assignment, int $i) use ($slots) {
            foreach ([0, 2] as $dayOffset) {
                $day = Carbon::now()->startOfWeek()->addDays($dayOffset);

                ClassSession::factory()->create([
                    'teaching_subject_classe_id' => $assignment->id,
                    'start_time' => $day->copy()->setTimeFromTimeString($slots[$i % 3][0]),
                    'end_time' => $day->copy()->setTimeFromTimeString($slots[$i % 3][1]),
                ]);
            }
        });

        // ------------------------------------------------------------------
        // Students (+ parents), exams, grades, absences
        // ------------------------------------------------------------------
        $student = User::factory()->create([
            'firstname' => 'Demo',
            'lastname' => 'Student',
            'email' => 'student@school.test',
            'password' => $demoPassword,
            'classe_id' => $classes[0]->id,
            'student_parent_id' => $parent->id,
        ]);

        $students = collect([$student]);
        foreach ($classes as $classe) {
            $students = $students->merge(
                User::factory()->count(4)->create([
                    'classe_id' => $classe->id,
                    'student_parent_id' => StudentParent::factory()->create()->id,
                ])
            );
        }

        $exams = $assignments->map(fn (TeachingSubjectClasse $assignment) => Exam::factory()->create([
            'name' => 'Contrôle 1 — '.$assignment->subject->name,
            'type' => 'written',
            'exam_date' => Carbon::now()->subDays(random_int(5, 20))->toDateString(),
            'teaching_subject_classe_id' => $assignment->id,
        ]));

        $appreciations = ['Excellent travail', 'Bon niveau', 'Peut mieux faire', 'Doit se concentrer'];

        $exams->each(function (Exam $exam) use ($appreciations) {
            $exam->classe->students->each(function (User $s) use ($exam, $appreciations) {
                Grade::factory()->create([
                    'exam_id' => $exam->id,
                    'user_id' => $s->id,
                    'note' => fake()->randomFloat(2, 6, 19),
                    'appreciation' => fake()->randomElement($appreciations),
                ]);
            });
        });

        ClassSession::with('classe')->get()->each(function (ClassSession $session) {
            $session->classe->students->random((int) max(1, floor($session->classe->students->count() / 2)))
                ->each(fn (User $s) => Absence::factory()->create([
                    'class_session_id' => $session->id,
                    'user_id' => $s->id,
                    'justified' => fake()->boolean(30),
                ]));
        });

        // ------------------------------------------------------------------
        // Finances
        // ------------------------------------------------------------------
        foreach ($students as $s) {
            Payment::factory()->create([
                'user_id' => $s->id,
                'admin_id' => $admin->id,
                'status' => 'completed',
            ]);
            Payment::factory()->pending()->create([
                'user_id' => $s->id,
                'admin_id' => $admin->id,
            ]);
        }

        foreach (Teacher::all() as $t) {
            Salary::factory()->create([
                'teacher_id' => $t->id,
                'admin_id' => $admin->id,
                'mois' => Carbon::now()->format('Y-m'),
                'status' => 'completed',
            ]);
            Salary::factory()->pending()->create([
                'teacher_id' => $t->id,
                'admin_id' => $admin->id,
                'mois' => Carbon::now()->format('Y-m'),
            ]);
        }
    }
}
