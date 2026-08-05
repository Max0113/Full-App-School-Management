<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Subject::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string"
        ]);

        $data = Subject::create($validated);

        return response()->json([
            "status" => 201,
            "data" => $data
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Subject $level)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subject $level)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $validated = $request->validate([
            "name" => "required|string"
        ]);

        $subject = Subject::findOrFail($id);

        $subject->update($validated);

        return response()->json([
            "status" => 200,
            "data" => $subject
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();
        return response()->json([
            "status" => 200,
            "data" => $subject
        ]);
    }
}
