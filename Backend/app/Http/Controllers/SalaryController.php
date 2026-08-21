<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSalaryRequest;
use App\Http\Requests\UpdateSalaryRequest;
use App\Models\Salary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SalaryController extends Controller
{
    /**
     * Display a listing of the resource. Filters: teacher_id, status, mois.
     */
    public function index()
    {
        $query = DB::table('salaries')
            ->join('teachers', 'salaries.teacher_id', '=', 'teachers.id')
            ->select(
                'salaries.*',
                'teachers.firstname as teacher_firstname',
                'teachers.lastname as teacher_lastname'
            )
            ->whereNull('salaries.deleted_at')
            ->whereNull('teachers.deleted_at')
            ->orderByDesc('salaries.date_payment');

        if ($teacherId = request()->query('teacher_id')) {
            $query->where('salaries.teacher_id', $teacherId);
        }
        if ($status = request()->query('status')) {
            $query->where('salaries.status', $status);
        }
        if ($mois = request()->query('mois')) {
            $query->where('salaries.mois', $mois);
        }

        return $this->paginated($query->paginate(max(1, (int) request()->query('per_page', 15))));
    }

    /**
     * Monthly payout overview for one month ("2026-08" or label as stored).
     */
    public function monthly(string $mois)
    {
        $rows = DB::table('salaries')
            ->join('teachers', 'salaries.teacher_id', '=', 'teachers.id')
            ->select(
                'salaries.*',
                'teachers.firstname as teacher_firstname',
                'teachers.lastname as teacher_lastname'
            )
            ->where('salaries.mois', $mois)
            ->whereNull('salaries.deleted_at')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'mois' => $mois,
                'salaries' => $rows,
                'totals' => [
                    'paid' => (float) $rows->where('status', 'completed')->sum('amount'),
                    'in_progress' => (float) $rows->where('status', 'in_progress')->sum('amount'),
                    'pending' => (float) $rows->where('status', 'pending')->sum('amount'),
                    'count' => $rows->count(),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage. The recording admin is the authenticated one.
     */
    public function store(StoreSalaryRequest $request)
    {
        $validated = $request->validated();
        $validated['admin_id'] = $request->user('sanctum')->getAuthIdentifier();
        $validated['status'] ??= 'pending';

        $salary = Salary::create($validated);

        return response()->json([
            'status' => 201,
            'data' => $salary,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Salary $salary)
    {
        return response()->json([
            'status' => 200,
            'data' => $salary,
        ]);
    }

    /**
     * Move a salary forward in its workflow: pending → in_progress → completed.
     */
    public function setStatus(Request $request, Salary $salary)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(Salary::STATUSES)],
        ]);

        $allowed = Salary::TRANSITIONS[$salary->status] ?? [];

        if (! in_array($validated['status'], $allowed, true)) {
            return response()->json([
                'status' => 422,
                'message' => "Invalid transition from '{$salary->status}' to '{$validated['status']}'.",
            ], 422);
        }

        $salary->update(['status' => $validated['status']]);

        return response()->json([
            'status' => 200,
            'data' => $salary,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSalaryRequest $request, Salary $salary)
    {
        $validated = $request->validated();
        unset($validated['status']);

        $salary->update($validated);

        return response()->json([
            'status' => 200,
            'data' => $salary,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Salary $salary)
    {
        $salary->delete();

        return response()->noContent();
    }
}
