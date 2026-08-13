<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\StudentResource;
use DateTime;
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
        ->join('student_parents', 'users.student_parent_id', '=', 'student_parents.id')
        ->select(
            'users.*',
            'student_parents.id as parent_id',
            'student_parents.firstname as parent_firstname',
            'student_parents.lastname as parent_lastname'
        )
        ->whereNull('users.deleted_at')
        ->get();

        return StudentResource::collection($results);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        $validated['last_login_date'] = (new DateTime())->format('Y-m-d');

        $student = User::create($validated);

        return new StudentResource($student);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $validated = $request->validated();
        $student = User::findOrFail($id);

        if(!isset($validated['password'])){
            $validated['password'] = $student['password'];
        }else {
            $validated['password'] = Hash::make($validated['password']);
        };

        $student->update($validated);
        return new StudentResource($student);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $student = User::findOrFail($id);
        $student->delete();
        return new StudentResource($student);
    }
}
