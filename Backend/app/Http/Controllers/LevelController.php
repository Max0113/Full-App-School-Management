<?php

namespace App\Http\Controllers;

use App\Models\Level;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'status' => 200,
            'data' => Level::all(),
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

        $data = Level::create($validated);

        return response()->json([
            'status' => 201,
            'data' => $data,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Level $level)
    {
        return response()->json([
            'status' => 200,
            'data' => $level,
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

        $level = Level::findOrFail($id);

        $level->update($validated);

        return response()->json([
            'status' => 200,
            'data' => $level,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $level = Level::findOrFail($id);
        $level->delete();

        return response()->noContent();
    }
}
