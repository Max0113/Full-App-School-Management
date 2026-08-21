<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreGradeRequest extends FormRequest
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
            'exam_id' => 'required|integer|exists:exams,id',
            'user_id' => 'required|integer|exists:users,id',
            'note' => 'required|numeric|min:0|max:20',
            'appreciation' => 'required|string|max:255',
        ];
    }
}
