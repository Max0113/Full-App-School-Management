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
        return Level::all();
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

        $data = Level::create($validated);

        return response()->json([
            "status" => 201,
            "data" => $data
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Level $level)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Level $level)
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

        $level = Level::findOrFail($id);

        $level->update($validated);

        return response()->json([
            "status" => 200,
            "data" => $level
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $level = Level::findOrFail($id);
        $level->delete();
        return response()->json([
            "status" => 200,
            "data" => $level
        ]);
    }
}
