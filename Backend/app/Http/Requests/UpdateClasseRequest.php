<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateClasseRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'level_id' => 'required|integer|exists:levels,id',
            'specialite_id' => 'required|integer|exists:specialites,id',
            'school_year_id' => 'required|integer|exists:school_years,id',
        ];
    }
}
