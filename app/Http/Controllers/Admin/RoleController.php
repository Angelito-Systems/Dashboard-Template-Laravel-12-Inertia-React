<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    /**
     * Display a listing of roles
     */
    public function index()
    {
        return Inertia::render('Admin/Roles/Index', [
            'roles' => Role::all()
        ]);
    }

    /**
     * Show the form for creating a new role
     */
    public function create()
    {
        return Inertia::render('Admin/Roles/Form', [
            'permissions' => Permission::all()
        ]);
    }

    /**
     * Store a newly created role
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name',
            ]);
            
            DB::beginTransaction();
            
            $role = Role::create([
                'name' => $validated['name'],
                'guard_name' => 'web'
            ]);
            
            DB::commit();
            
            return redirect()->route('admin.roles.index')
                ->with('success', 'Rol creado correctamente');
        } catch (Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Error al crear el rol: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Show the form for editing a role
     */
    public function edit(Role $role)
    {
        return Inertia::render('Admin/Roles/Form', [
            'role' => $role,
            'permissions' => Permission::all()
        ]);
    }

    /**
     * Update the specified role
     */
    public function update(Request $request, Role $role)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            ]);
            
            DB::beginTransaction();
            
            $role->update([
                'name' => $validated['name']
            ]);
            
            DB::commit();
            
            return redirect()->route('admin.roles.index')
                ->with('success', 'Rol actualizado correctamente');
        } catch (Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Error al actualizar el rol: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified role
     */
    public function destroy(Role $role)
    {
        try {
            // Comprobar si hay usuarios con este rol
            if ($role->users->count() > 0) {
                return redirect()->route('admin.roles.index')
                    ->with('error', 'No se puede eliminar el rol porque está asignado a uno o más usuarios.');
            }
            
            DB::beginTransaction();
            
            // Eliminar las relaciones de permisos
            $role->permissions()->detach();
            // Eliminar el rol
            $role->delete();
            
            DB::commit();
            
            return redirect()->route('admin.roles.index')
                ->with('success', 'Rol eliminado correctamente');
        } catch (Exception $e) {
            DB::rollBack();
            
            return redirect()->route('admin.roles.index')
                ->with('error', 'Error al eliminar el rol: ' . $e->getMessage());
        }
    }
}
