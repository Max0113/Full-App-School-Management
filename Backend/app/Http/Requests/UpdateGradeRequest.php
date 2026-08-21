<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGradeRequest extends FormRequest
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
        $gradeId = $this->route('grade');

        return [
            'exam_id' => 'required|integer|exists:exams,id',
            'user_id' => 'required|integer|exists:users,id',
            'note' => 'required|numeric|min:0|max:20',
            'appreciation' => 'required|string|max:255',
        ];
    }
}
