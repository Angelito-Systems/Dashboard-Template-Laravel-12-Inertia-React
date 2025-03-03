<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Exception;
use Illuminate\Support\Facades\DB;

class RolePermissionController extends Controller
{
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        try {
            // Obtener todos los permisos
            $allPermissions = Permission::all();
            
            // Agrupar permisos por un prefijo más inteligente
            $groupedPermissions = $allPermissions->groupBy(function($permission) {
                // Dividimos el nombre por puntos
                $parts = explode('.', $permission->name);
                
                // Si tenemos al menos una parte, usamos la primera como prefijo
                if (count($parts) > 1) {
                    return $parts[0]; // Ejemplo: 'users.create' -> 'users'
                }
                
                // Si no hay punto, intentamos extraer un prefijo lógico
                $name = $permission->name;
                if (Str::contains($name, '_')) {
                    $parts = explode('_', $name);
                    return $parts[0]; // Ejemplo: 'users_create' -> 'users'
                }
                
                // Intentamos extraer un prefijo basado en palabras comunes
                $possiblePrefixes = ['create', 'edit', 'delete', 'view', 'list', 'manage'];
                foreach ($possiblePrefixes as $prefix) {
                    if (Str::startsWith($name, $prefix)) {
                        // Extraer el sujeto (lo que viene después del prefijo)
                        $subject = substr($name, strlen($prefix));
                        return Str::camel($subject); // Ejemplo: 'createUser' -> 'user'
                    }
                }
                
                // Si no podemos agrupar, lo ponemos en "general"
                return 'general';
            });
            
            // Asegurémonos de que cada grupo es un array
            $permissions = [];
            foreach ($groupedPermissions as $group => $perms) {
                $permissions[$group] = is_array($perms) ? $perms : $perms->toArray();
            }
            
            // Ordenar grupos alfabéticamente
            ksort($permissions);
            
            // Obtener los IDs de los permisos asignados a este rol
            $rolePermissions = $role->permissions->pluck('id')->toArray();
    
            return Inertia::render('Admin/Roles/Permissions', [
                'role' => $role,
                'permissions' => $permissions,
                'rolePermissions' => $rolePermissions
            ]);
        } catch (Exception $e) {
            return redirect()->route('admin.roles.index')
                ->with('error', 'Error al cargar los permisos: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        try {
            $validated = $request->validate([
                'permissions' => 'required|array',
                'permissions.*' => 'exists:permissions,id',
            ]);
            
            DB::beginTransaction();
            
            $role->syncPermissions($validated['permissions']);
            
            DB::commit();
            
            return redirect()->route('admin.roles.index')
                ->with('success', 'Permisos del rol actualizados correctamente');
        } catch (Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Error al actualizar los permisos del rol: ' . $e->getMessage())
                ->withInput();
        }
    }
}
