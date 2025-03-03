<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Exception;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $users = User::with('roles')
            ->orderBy('name')
            ->paginate(10);
            
        $roles = Role::all();
            
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    // Ya no necesitamos estas rutas ya que manejaremos todo en el índice con modales
    // public function create()
    // {
    //     $roles = Role::all();
    //     return Inertia::render('Admin/Users/Create', [
    //         'roles' => $roles
    //     ]);
    // }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'roles' => 'required|array'
            ]);
            
            DB::beginTransaction();
            
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            
            $user->assignRole($validated['roles']);
            
            DB::commit();
            
            return redirect()->back()
                ->with('success', 'Usuario creado exitosamente');
                
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error al crear el usuario: ' . $e->getMessage())
                ->withInput();
        }
    }

    // Ya no necesitamos esta ruta específica para editar
    // public function edit(User $user)
    // {
    //     $roles = Role::all();
    //     return Inertia::render('Admin/Users/Edit', [
    //         'user' => $user->load('roles'),
    //         'roles' => $roles
    //     ]);
    // }

    public function update(Request $request, User $user)
    {
        try {
            // Reglas de validación básicas
            $rules = [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
                'roles' => 'required|array'
            ];
            
            // Si se proporciona una contraseña, agregar regla de validación
            if ($request->filled('password')) {
                $rules['password'] = 'string|min:8';
            }
            
            $validated = $request->validate($rules);
            
            DB::beginTransaction();
            
            // Preparar datos para actualizar
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];
            
            // Agregar contraseña solo si se proporcionó
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($validated['password']);
            }
            
            $user->update($userData);
            
            // Sincronizar roles
            $user->syncRoles($validated['roles']);
            
            DB::commit();
            
            return redirect()->route('admin.users.index')
                ->with('success', 'Usuario actualizado exitosamente');
        } catch (Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Error al actualizar el usuario: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function destroy(User $user)
    {
        try {
            DB::beginTransaction();
            
            // Eliminar roles y permisos
            $user->roles()->detach();
            $user->permissions()->detach();
            
            // Eliminar usuario
            $user->delete();
            
            DB::commit();
            
            return redirect()->route('admin.users.index')
                ->with('success', 'Usuario eliminado exitosamente');
        } catch (Exception $e) {
            DB::rollBack();
            
            return redirect()->route('admin.users.index')
                ->with('error', 'Error al eliminar el usuario: ' . $e->getMessage());
        }
    }
}
