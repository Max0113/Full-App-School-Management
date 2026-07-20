<?php

namespace App\Http\Controllers;

use App\Http\Resources\StudentParentResource;
use App\Models\StudentParent;
use App\Http\Requests\StoreStudentParentRequest;
use App\Http\Requests\UpdateStudentParentRequest;
use DateTime;
use Illuminate\Support\Facades\Hash;

class StudentParentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentParentRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        $validated['last_login_date'] = (new DateTime())->format('Y-m-d');

        $parent = StudentParent::create($validated);

        return new StudentParentResource($parent);
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentParent $studentParent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentParentRequest $request, $id)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        $studentParent = StudentParent::find($id);
        $studentParent->update($validated);
        return new StudentParentResource($studentParent);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $studentParent = StudentParent::find($id);
        $studentParent->delete();
        return new StudentParentResource($studentParent);
    }
}
