<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentParentRequest extends FormRequest
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
        $parentId = $this->route('parent');

        return [
            'firstname' => 'required|max:50',
            'lastname' => 'required|max:50',
            'date_of_birth' => 'required|date',
            'last_login_date' => 'date',
            'gender' => ['required', Rule::in(['m','f'])],
            'blood_type' => ['required', Rule::in([
                'O-',
                'O+',
                'A+',
                'A-',
                'B+',
                'B-',
                'AB+',
                'AB-'
            ])],
            'address' => 'required|max:50',
            'phone' => ['required', 'max:10', Rule::unique('student_parents')->ignore($parentId)],
            'email' => ['required', 'email', Rule::unique('student_parents')->ignore($parentId)],
            'password' => 'required|min:8'
        ];
    }
}
