<?php

namespace App\Http\Requests;

use App\Models\Salary;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSalaryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'teacher_id' => 'required|integer|exists:teachers,id',
            'amount' => 'required|numeric|min:0.01',
            'mois' => 'required|string|max:20',
            'date_payment' => 'required|date',
            'status' => ['sometimes', Rule::in(Salary::STATUSES)],
        ];
    }
}
