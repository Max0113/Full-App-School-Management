<?php

namespace App\Http\Controllers;

use App\Models\SchoolYear;
use Illuminate\Http\Request;

class SchoolYearController extends Controller
{
   /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SchoolYear::all();
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

        $data = SchoolYear::create($validated);

        return response()->json([
            "status" => 201,
            "data" => $data
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(SchoolYear $level)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SchoolYear $level)
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

        $year = SchoolYear::findOrFail($id);

        $year->update($validated);

        return response()->json([
            "status" => 200,
            "data" => $year
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $year = SchoolYear::findOrFail($id);
        $year->delete();
        return response()->json([
            "status" => 200,
            "data" => $year
        ]);
    }
}
