<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

/**
 * Ensures a code_masser is unique in the users table (only students have
 * a Massar code in this project), ignoring soft-deleted rows.
 */
class UniqueAccountMasser implements ValidationRule
{
    public function __construct(
        private ?int $ignoreId = null,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = DB::table('users')
            ->where('code_masser', $value)
            ->whereNull('deleted_at');

        if ($this->ignoreId !== null) {
            $query->where('id', '!=', $this->ignoreId);
        }

        if ($query->exists()) {
            $fail('The :attribute has already been taken.');
        }
    }
}