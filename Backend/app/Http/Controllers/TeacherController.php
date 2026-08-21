<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Http\Resources\TeacherResource;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Teacher::orderBy('id', 'desc')
            ->paginate(max(1, (int) request()->query('per_page', 15)));

        return $this->paginated($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeacherRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);

        $teacher = Teacher::create($validated);

        return response()->json([
            'status' => 201,
            'data' => new TeacherResource($teacher),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Teacher $teacher)
    {
        return response()->json([
            'status' => 200,
            'data' => new TeacherResource($teacher),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherRequest $request, $id)
    {
        $validated = $request->validated();
        $teacher = Teacher::findOrFail($id);
        if (! isset($validated['password'])) {
            $validated['password'] = $teacher['password'];
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $teacher->update($validated);

        return response()->json([
            'status' => 200,
            'data' => new TeacherResource($teacher),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->delete();

        return response()->noContent();
    }
}
