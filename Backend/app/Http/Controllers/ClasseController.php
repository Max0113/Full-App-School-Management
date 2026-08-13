<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClasseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $results = DB::table('classes')
            ->join('levels', 'classes.level_id', '=', 'levels.id')
            ->join('specialites', 'classes.specialite_id', '=', 'specialites.id')
            ->join('school_years', 'classes.school_year_id', '=', 'school_years.id')
            ->select(
                'classes.*',
                'levels.name as level_name',
                'specialites.name as specialite_name',
                'school_years.name as school_year_name'
            )
            ->whereNull('classes.deleted_at')
            ->get();

        return response()->json([
            "status" => 200,
            "data" => $results
        ], 200);
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
            "name" => "required|string",
            "level_id" => "required|integer|exists:levels,id",
            "specialite_id" => "required|integer|exists:specialites,id",
            "school_year_id" => "required|integer|exists:school_years,id",
        ]);

        $data = Classe::create($validated);

        return response()->json([
            "status" => 202,
            "data" => $data
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Classe $classe)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Classe $classe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $validated = $request->validate([
            "name" => "required|string",
            "level_id" => "required|integer|exists:levels,id",
            "specialite_id" => "required|integer|exists:specialites,id",
            "school_year_id" => "required|integer|exists:school_years,id",
        ]);

        $classe = Classe::findOrFail($id);

        $classe->update($validated);

        return response()->json([
            "status" => 202,
            "data" => $classe
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $classe = Classe::find($id);

        if (!$classe) {
            return response()->json([
                "status" => 404,
                "message" => "Classe not found"
            ], 404);
        }

        $classe->delete();

        return response()->json([
            "status" => 202,
            "data" => $classe
        ], 202);
    }
}
