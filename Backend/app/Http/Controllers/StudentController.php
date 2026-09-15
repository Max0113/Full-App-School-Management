<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\StudentResource;
use App\Models\Classe;
use App\Models\StudentClasse;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = $this->studentBaseQuery();

        if ($classeId = request()->query('classe_id')) {
            $query->where('student_classes.classe_id', $classeId);
        }

        $results = $query
            ->orderBy('users.id', 'desc')
            ->paginate(max(1, (int) request()->query('per_page', 15)));

        return $this->paginated($results);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();
        $classeId = $validated['classe_id'] ?? null;
        unset($validated['classe_id']);

        $validated['password'] = Hash::make($validated['password']);

        $student = User::create($validated);

        if ($classeId) {
            $this->syncClasse($student, $classeId);
        }

        return response()->json([
            'status' => 201,
            'data' => new StudentResource($student),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $student)
    {
        $data = $this->studentBaseQuery()
            ->where('users.id', $student->id)
            ->first();

        return response()->json([
            'status' => 200,
            'data' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $validated = $request->validated();
        $student = User::findOrFail($id);

        $classeId = $validated['classe_id'] ?? null;
        unset($validated['classe_id']);

        if (! isset($validated['password'])) {
            $validated['password'] = $student['password'];
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $student->update($validated);

        if ($classeId) {
            $this->syncClasse($student, $classeId);
        }

        return response()->json([
            'status' => 200,
            'data' => new StudentResource($student),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $student = User::findOrFail($id);
        $student->delete();

        return response()->noContent();
    }

    /**
     * Base query joining a student's parent and their latest class membership.
     */
    private function studentBaseQuery()
    {
        $latestMembership = DB::table('student_classes')
            ->select('student_id', DB::raw('MAX(id) as id'))
            ->whereNull('deleted_at')
            ->groupBy('student_id');

        return DB::table('users')
            ->leftJoin('student_parents', 'users.student_parent_id', '=', 'student_parents.id')
            ->leftJoinSub($latestMembership, 'latest_membership', 'latest_membership.student_id', '=', 'users.id')
            ->leftJoin('student_classes', 'student_classes.id', '=', 'latest_membership.id')
            ->leftJoin('classes', 'classes.id', '=', 'student_classes.classe_id')
            ->select(
                'users.id',
                'users.firstname',
                'users.lastname',
                'users.email',
                DB::raw("'student' as role"),
                'users.address',
                'users.phone',
                'users.code_masser',
                'users.student_parent_id',
                'student_classes.classe_id',
                'users.date_of_birth',
                'users.gender',
                'student_parents.firstname as parent_firstname',
                'student_parents.lastname as parent_lastname',
                'classes.name as classe_name'
            )
            ->whereNull('users.deleted_at')
            ->whereNull('student_parents.deleted_at')
            ->whereNull('student_classes.deleted_at')
            ->whereNull('classes.deleted_at');
    }

    /**
     * Attach a student to a class for the class's current school year.
     */
    private function syncClasse(User $student, int $classeId): void
    {
        $classe = Classe::find($classeId);
        if (! $classe) {
            return;
        }

        StudentClasse::updateOrCreate(
            [
                'student_id' => $student->id,
                'school_year_id' => $classe->school_year_id,
            ],
            [
                'classe_id' => $classeId,
            ]
        );
    }
}
