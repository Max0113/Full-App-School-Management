<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'type' => 'required|string|in:Département Normal,Département informatique,Département mathématiques,Département physique,Département chimie,Département biologie',
            'availability' => 'sometimes|boolean',
        ];
    }
}
