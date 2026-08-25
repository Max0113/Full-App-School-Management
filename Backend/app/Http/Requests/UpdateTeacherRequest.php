<?php

namespace App\Http\Requests;

use App\Rules\UniqueAccountEmail;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeacherRequest extends FormRequest
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
        $Id = $this->route('teacher');

        return [
            'firstname' => 'required|max:50',
            'lastname' => 'required|max:50',
            'date_of_birth' => 'required|date',
            'last_login_date' => 'date',
            'gender' => ['required', Rule::in(['m', 'f'])],
            'cin' => ['required', 'string', 'max:12', Rule::unique('teachers')->ignore($Id)],
            'address' => 'required|max:50',
            'phone' => ['required', 'max:10', Rule::unique('teachers')->ignore($Id)],
            'email' => ['required', 'email', new UniqueAccountEmail('teachers', is_numeric($Id) ? (int) $Id : $Id?->id)],
            'password' => 'min:8',
        ];
    }
}
