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
        return response()->json([
            'status' => 200,
            'data' => SchoolYear::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $data = SchoolYear::create($validated);

        return response()->json([
            'status' => 201,
            'data' => $data,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SchoolYear $schoolYear)
    {
        return response()->json([
            'status' => 200,
            'data' => $schoolYear,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $year = SchoolYear::findOrFail($id);

        $year->update($validated);

        return response()->json([
            'status' => 200,
            'data' => $year,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $year = SchoolYear::findOrFail($id);
        $year->delete();

        return response()->noContent();
    }
}
