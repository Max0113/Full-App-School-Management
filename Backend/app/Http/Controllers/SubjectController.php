<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Subject;
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
            ->whereNull('specialites.deleted_at')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $results,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubjectRequest $request)
    {
        $data = Subject::create($request->validated());

        return response()->json([
            'status' => 201,
            'data' => $data,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Subject $subject)
    {
        return response()->json([
            'status' => 200,
            'data' => $subject,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubjectRequest $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $subject->update($request->validated());

        return response()->json([
            'status' => 200,
            'data' => $subject,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->noContent();
    }
}
