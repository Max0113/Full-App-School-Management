<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource. Filters: user_id, status, type_payment.
     */
    public function index()
    {
        $query = DB::table('payments')
            ->join('users', 'payments.user_id', '=', 'users.id')
            ->select(
                'payments.*',
                'users.firstname as student_firstname',
                'users.lastname as student_lastname'
            )
            ->whereNull('payments.deleted_at')
            ->whereNull('users.deleted_at')
            ->orderByDesc('payments.date_payment');

        if ($userId = request()->query('user_id')) {
            $query->where('payments.user_id', $userId);
        }
        if ($status = request()->query('status')) {
            $query->where('payments.status', $status);
        }
        if ($type = request()->query('type_payment')) {
            $query->where('payments.type_payment', $type);
        }

        return $this->paginated($query->paginate(max(1, (int) request()->query('per_page', 15))));
    }

    /**
     * Receipts for one student with totals.
     */
    public function receipts(User $student)
    {
        $rows = DB::table('payments')
            ->where('user_id', $student->id)
            ->whereNull('deleted_at')
            ->orderByDesc('date_payment')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'firstname' => $student->firstname,
                    'lastname' => $student->lastname,
                ],
                'payments' => $rows,
                'totals' => [
                    'paid' => (float) $rows->where('status', 'completed')->sum('amount'),
                    'in_progress' => (float) $rows->where('status', 'in_progress')->sum('amount'),
                    'pending' => (float) $rows->where('status', 'pending')->sum('amount'),
                ],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage. The recording admin is the authenticated one.
     */
    public function store(StorePaymentRequest $request)
    {
        $validated = $request->validated();
        $validated['admin_id'] = $request->user('sanctum')->getAuthIdentifier();
        $validated['status'] ??= 'pending';

        $payment = Payment::create($validated);

        return response()->json([
            'status' => 201,
            'data' => $payment,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        return response()->json([
            'status' => 200,
            'data' => $payment,
        ]);
    }

    /**
     * Move a payment forward in its workflow: pending → in_progress → completed.
     */
    public function setStatus(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(Payment::STATUSES)],
        ]);

        $allowed = Payment::TRANSITIONS[$payment->status] ?? [];

        if (! in_array($validated['status'], $allowed, true)) {
            return response()->json([
                'status' => 422,
                'message' => "Invalid transition from '{$payment->status}' to '{$validated['status']}'.",
            ], 422);
        }

        $payment->update(['status' => $validated['status']]);

        return response()->json([
            'status' => 200,
            'data' => $payment,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $validated = $request->validated();
        unset($validated['status']);

        $payment->update($validated);

        return response()->json([
            'status' => 200,
            'data' => $payment,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->noContent();
    }
}
