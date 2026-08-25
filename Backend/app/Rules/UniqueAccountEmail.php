<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

/**
 * Ensures an email is unique across every account table (students, teachers,
 * admins, parents) since login resolves credentials against all of them.
 */
class UniqueAccountEmail implements ValidationRule
{
    /**
     * @param  string|null  $ignoreTable  Table whose record should be excluded (the one being updated).
     * @param  int|null  $ignoreId  Primary key of the record being updated.
     */
    public function __construct(
        private ?string $ignoreTable = null,
        private ?int $ignoreId = null,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        foreach (['users', 'teachers', 'admins', 'student_parents'] as $table) {
            $query = DB::table($table)->where('email', $value)->whereNull('deleted_at');

            if ($this->ignoreTable === $table && $this->ignoreId !== null) {
                $query->where('id', '!=', $this->ignoreId);
            }

            if ($query->exists()) {
                $fail('The :attribute has already been taken.');

                return;
            }
        }
    }
}
