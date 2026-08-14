<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $results = DB::table('subjects')
            ->join('specialites', 'subjects.specialite_id', '=', 'specialites.id')
            ->select(
                'subjects.*',
                'specialites.name as specialite_name',
            )
            ->whereNull('subjects.deleted_at')
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
            "specialite_id" => "required|integer|exists:specialites,id",
            "facture" => "required|integer|min:1"
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
            "name" => "required|string",
            "specialite_id" => "required|integer|exists:specialites,id",
            "facture" => "required|integer|min:1"
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
