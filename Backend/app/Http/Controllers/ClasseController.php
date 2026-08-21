<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClasseRequest;
use App\Http\Requests\UpdateClasseRequest;
use App\Models\Classe;
use Illuminate\Support\Facades\DB;

class ClasseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $results = Classe::with(['level', 'specialite', 'schoolYear'])
            ->whereHas('level', function ($q) {
                $q->whereNull('deleted_at');
            })
            ->whereHas('specialite', function ($q) {
                $q->whereNull('deleted_at');
            })
            ->whereHas('schoolYear', function ($q) {
                $q->whereNull('deleted_at');
            })
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $results,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClasseRequest $request)
    {
        $data = Classe::create($request->validated());

        return response()->json([
            'status' => 201,
            'data' => $data,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Classe $classe)
    {
        return response()->json([
            'status' => 200,
            'data' => $classe,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClasseRequest $request, $id)
    {
        $classe = Classe::findOrFail($id);

        $classe->update($request->validated());

        return response()->json([
            'status' => 200,
            'data' => $classe,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $classe = Classe::find($id);

        if (! $classe) {
            return response()->json([
                'status' => 404,
                'message' => 'Classe not found',
            ], 404);
        }

        $classe->delete();

        return response()->noContent();
    }
}
