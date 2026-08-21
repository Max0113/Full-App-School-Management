<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentParentRequest;
use App\Http\Requests\UpdateStudentParentRequest;
use App\Http\Resources\StudentParentResource;
use App\Models\StudentParent;
use Illuminate\Support\Facades\Hash;

class StudentParentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $parents = StudentParent::orderBy('id', 'desc')
            ->paginate(max(1, (int) request()->query('per_page', 15)));

        return $this->paginated($parents);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentParentRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);

        $parent = StudentParent::create($validated);

        return response()->json([
            'status' => 201,
            'data' => new StudentParentResource($parent),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentParent $studentParent)
    {
        return response()->json([
            'status' => 200,
            'data' => new StudentParentResource($studentParent),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentParentRequest $request, $id)
    {
        $validated = $request->validated();
        $studentParent = StudentParent::findOrFail($id);
        if (! isset($validated['password'])) {
            $validated['password'] = $studentParent['password'];
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $studentParent->update($validated);

        return response()->json([
            'status' => 200,
            'data' => new StudentParentResource($studentParent),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $studentParent = StudentParent::findOrFail($id);
        $studentParent->delete();

        return response()->noContent();
    }
}
