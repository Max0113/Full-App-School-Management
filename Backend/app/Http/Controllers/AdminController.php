<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use DateTime;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Admin::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdminRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        $validated['last_login_date'] = (new DateTime())->format('Y-m-d');

        $admin = Admin::create($validated);

        return response()->json([
            "status" => 202,
            "data" => $admin
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdminRequest $request, $id)
    {
        $validated = $request->validated();
        $admin = Admin::findOrFail($id);
        if(!isset($validated['password'])){
            $validated['password'] = $admin['password'];
        }else {
            $validated['password'] = Hash::make($validated['password']);
        };

        $admin->update($validated);
        return response()->json([
            "status" => 202,
            "data" => $admin
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();
        return response()->json([
            "status" => 202,
            "data" => $admin
        ]);
    }
}
