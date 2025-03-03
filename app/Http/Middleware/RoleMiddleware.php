<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\Exceptions\UnauthorizedException;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role, $guard = null)
    {
        $roles = is_array($role) ? $role : explode('|', $role);

        if (!$request->user() || !$request->user()->hasAnyRole($roles)) {

            // responder con INERTHIA Y UNA VISTA DE ERROR
            
            throw UnauthorizedException::forRoles($roles);
        }

        return $next($request);
    }
}
