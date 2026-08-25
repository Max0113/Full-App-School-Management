<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\StudentResource;
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
        $results = DB::table('users')
            ->leftJoin('student_parents', 'users.student_parent_id', '=', 'student_parents.id')
            ->leftJoin('classes', 'users.classe_id', '=', 'classes.id')
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
                'users.classe_id',
                'users.date_of_birth',
                'users.gender',
                'student_parents.firstname as parent_firstname',
                'student_parents.lastname as parent_lastname',
                'classes.name as classe_name'
            )
            ->whereNull('users.deleted_at')
            ->whereNull('student_parents.deleted_at')
            ->whereNull('classes.deleted_at')
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
        $validated['password'] = Hash::make($validated['password']);

        $student = User::create($validated);

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
        $data = DB::table('users')
            ->leftJoin('student_parents', 'users.student_parent_id', '=', 'student_parents.id')
            ->leftJoin('classes', 'users.classe_id', '=', 'classes.id')
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
                'users.classe_id',
                'users.date_of_birth',
                'users.gender',
                'student_parents.firstname as parent_firstname',
                'student_parents.lastname as parent_lastname',
                'classes.name as classe_name'
            )
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

        if (! isset($validated['password'])) {
            $validated['password'] = $student['password'];
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $student->update($validated);

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
}
