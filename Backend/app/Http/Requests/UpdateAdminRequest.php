<?php

namespace App\Http\Requests;

use App\Rules\UniqueAccountEmail;
use App\Rules\UniqueAccountCIN;
use App\Rules\UniqueAccountPhone;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminRequest extends FormRequest
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
        $Id = $this->route('admin');

        return [
            'firstname' => 'required|max:50',
            'lastname' => 'required|max:50',
            'date_of_birth' => 'required|date',
            'last_login_date' => 'date',
            'gender' => ['required', Rule::in(['m', 'f'])],
            'cin' => ['required', 'string', 'max:12', new UniqueAccountCIN('admins', is_numeric($Id) ? (int) $Id : $Id?->id)],
            'address' => 'required|max:50',
            'phone' => ['required', 'max:10', new UniqueAccountPhone('admins', is_numeric($Id) ? (int) $Id : $Id?->id)],
            'email' => ['required', 'email', new UniqueAccountEmail('admins', is_numeric($Id) ? (int) $Id : $Id?->id)],
            'password' => 'min:8',
        ];
    }
}
