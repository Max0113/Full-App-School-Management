<?php

namespace App\Http\Controllers;

use App\Models\Specialite;
use Illuminate\Http\Request;

class SpecialiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Specialite::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string"
        ]);

        $data = Specialite::create($validated);

        return response()->json([
            "status" => 201,
            "data" => $data
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Specialite $specialite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            "name" => "required|string"
        ]);

        $specialite = Specialite::findOrFail($id);

        $specialite->update($validated);

        return response()->json([
            "status" => 200,
            "data" => $specialite
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $specialite = Specialite::findOrFail($id);
        $specialite->delete();
        return response()->json([
            "status" => 200,
            "data" => $specialite
        ]);
    }
}
