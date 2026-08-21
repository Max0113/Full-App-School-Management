<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAbsenceRequest extends FormRequest
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
            'class_session_id' => 'required|integer|exists:class_sessions,id',
            'user_id' => 'required|integer|exists:users,id',
            'justified' => ['sometimes', 'boolean'],
        ];
    }
}
