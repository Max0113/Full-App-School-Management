<?php

namespace App\Http\Requests;

use App\Rules\UniqueAccountEmail;
use App\Rules\UniqueAccountMasser;
use App\Rules\UniqueAccountPhone;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
        $Id = $this->route('student');

        return [
            'firstname' => 'required|max:50',
            'lastname' => 'required|max:50',
            'date_of_birth' => 'required|date',
            'last_login_date' => 'date',
            'gender' => ['required', Rule::in(['m', 'f'])],
            'code_masser' => ['required', 'string', 'size:10', new UniqueAccountMasser(is_numeric($Id) ? (int) $Id : $Id?->id), 'regex:/^[A-Z][0-9]{9}$/' ],
            'address' => 'required|max:50',
            'phone' => ['required', 'max:10', new UniqueAccountPhone('users', is_numeric($Id) ? (int) $Id : $Id?->id)],
            'email' => ['required', 'email', new UniqueAccountEmail('users', is_numeric($Id) ? (int) $Id : $Id?->id)],
            'password' => 'min:8',
            'student_parent_id' => 'required|integer|exists:student_parents,id',
            'classe_id' => 'required|integer|exists:classes,id',
        ];
    }
}
