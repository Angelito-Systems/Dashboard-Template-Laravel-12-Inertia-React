import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Role } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Save, ArrowLeft, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { alerts } from '@/lib/alerts';

interface Permission {
    id: number;
    name: string;
}

interface PermissionsPageProps extends PageProps {
    role: Role;
    permissions: Record<string, Permission[]>;
    rolePermissions: number[];
}

export default function Permissions({ role, permissions, rolePermissions }: PermissionsPageProps) {
    const { data, setData, processing } = useForm({
        permissions: [...rolePermissions]
    });
    
    // Asegurar que permissions es un objeto con arrays como valores
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
    
    useEffect(() => {
        // Convertir o asegurar que todas las entradas en permissions son arrays
        const safePermissions: Record<string, Permission[]> = {};
        
        Object.entries(permissions).forEach(([group, perms]) => {
            // Asegurar que perms es un array
            safePermissions[group] = Array.isArray(perms) ? perms : [perms].filter(Boolean);
        });
        
        setGroupedPermissions(safePermissions);
    }, [permissions]);
    
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    
    // Inicializar expandedGroups cuando groupedPermissions cambia
    useEffect(() => {
        setExpandedGroups(
            Object.keys(groupedPermissions).reduce((acc, group) => ({...acc, [group]: true}), {})
        );
    }, [groupedPermissions]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Roles', href: route('admin.roles.index') },
        { title: `Permisos - ${role.name}`, href: route('admin.roles.permissions.edit', role.id) },
    ];

    // Función para formatear los nombres de permisos para mostrar
    const formatPermissionName = (permissionName: string): string => {
        // Quitar el prefijo grupal si existe (ej: "users.create" -> "create")
        let displayName = permissionName;
        
        if (permissionName.includes('.')) {
            displayName = permissionName.split('.').slice(1).join(' ');
        } else if (permissionName.includes('_')) {
            displayName = permissionName.split('_').slice(1).join(' ');
        }
        
        // Convertir a formato legible
        return displayName
            // Insertar espacios entre camelCase
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            // Capitalizar primera letra
            .replace(/^\w/, c => c.toUpperCase());
    };

    // Formatear los nombres de los grupos
    const formatGroupName = (groupName: string): string => {
        return groupName
            .replace(/-/g, ' ')
            .replace(/^\w/, c => c.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2');
    };

    const handlePermissionToggle = (permissionId: number) => {
        const currentPermissions = [...data.permissions];
        const permissionIndex = currentPermissions.indexOf(permissionId);
        
        if (permissionIndex !== -1) {
            currentPermissions.splice(permissionIndex, 1);
        } else {
            currentPermissions.push(permissionId);
        }
        
        setData('permissions', currentPermissions);
    };
    
    const handleGroupToggle = (groupPermissions: Permission[], checked: boolean) => {
        if (!Array.isArray(groupPermissions)) {
            console.error("groupPermissions is not an array:", groupPermissions);
            return;
        }
        
        const permissionIds = groupPermissions.map(p => p.id);
        let newPermissions = [...data.permissions];
        
        if (checked) {
            // Añadir todos los permisos del grupo que no estén ya incluidos
            permissionIds.forEach(id => {
                if (!newPermissions.includes(id)) {
                    newPermissions.push(id);
                }
            });
        } else {
            // Quitar todos los permisos del grupo
            newPermissions = newPermissions.filter(id => !permissionIds.includes(id));
        }
        
        setData('permissions', newPermissions);
    };
    
    const isGroupChecked = (groupPermissions: Permission[]): boolean => {
        if (!Array.isArray(groupPermissions) || groupPermissions.length === 0) {
            return false;
        }
        return groupPermissions.every(permission => data.permissions.includes(permission.id));
    };
    
    const isGroupIndeterminate = (groupPermissions: Permission[]): boolean => {
        if (!Array.isArray(groupPermissions) || groupPermissions.length === 0) {
            return false;
        }
        const selectedCount = groupPermissions.filter(permission => data.permissions.includes(permission.id)).length;
        return selectedCount > 0 && selectedCount < groupPermissions.length;
    };
    
    const getGroupProgress = (groupPermissions: Permission[]): number => {
        if (!Array.isArray(groupPermissions) || groupPermissions.length === 0) {
            return 0;
        }
        const selectedCount = groupPermissions.filter(permission => data.permissions.includes(permission.id)).length;
        return (selectedCount / groupPermissions.length) * 100;
    };

    const toggleGroupExpansion = (group: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };
    
    const selectAllPermissions = () => {
        const allPermissionIds = Object.values(groupedPermissions)
            .flat()
            .map(permission => permission.id);
        setData('permissions', allPermissionIds);
        alerts.info("Permisos seleccionados", "Se han seleccionado todos los permisos disponibles.");
    };
    
    const deselectAllPermissions = () => {
        setData('permissions', []);
        alerts.info("Permisos deseleccionados", "Se han deseleccionado todos los permisos.");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('admin.roles.permissions.update', role.id), data, {
            onSuccess: () => {
                alerts.success(
                    "Permisos actualizados", 
                    `Los permisos para el rol "${role.name}" han sido actualizados correctamente.`
                );
            },
            onError: () => {
                alerts.error(
                    "Error al actualizar permisos", 
                    "Ha ocurrido un problema al actualizar los permisos del rol."
                );
            }
        });
    };

    // Calcular estadísticas de permisos
    const totalPermissions = Object.values(groupedPermissions).flat().length;
    const selectedPermissions = data.permissions.length;
    const percentageSelected = totalPermissions ? (selectedPermissions / totalPermissions) * 100 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Permisos - ${role.name}`} />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-foreground text-2xl font-bold">
                                Gestión de Permisos
                            </h2>
                            <div className="text-muted-foreground text-sm flex items-center">
                                Configurando permisos para el rol: 
                                <Badge variant="outline" className="ml-1 font-semibold">
                                    {role.name}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-hidden rounded-lg border-2 border-primary/20 shadow-md flex flex-col bg-background">
                    {/* Header con fondo de color - eliminamos cualquier componente UI que pueda añadir paddings o márgenes inesperados */}
                    <div className="w-full bg-primary/5 flex-none">
                        <div className="px-6 py-6 w-full">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-lg font-bold leading-tight mb-1">
                                        Resumen de Permisos
                                    </h3>
                                    <p className="text-sm text-muted-foreground m-0">
                                        Has seleccionado <span className="font-medium text-primary">{selectedPermissions}</span> de <span className="font-medium">{totalPermissions}</span> permisos disponibles
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={selectAllPermissions}
                                        className="flex items-center gap-1 whitespace-nowrap"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        <span className="hidden sm:inline">Seleccionar Todos</span>
                                        <span className="inline sm:hidden">Todos</span>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={deselectAllPermissions}
                                        className="flex items-center gap-1 whitespace-nowrap"
                                    >
                                        <Lock className="h-4 w-4 mr-1" />
                                        <span className="hidden sm:inline">Deseleccionar Todos</span>
                                        <span className="inline sm:hidden">Ninguno</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-3 w-full bg-secondary overflow-hidden rounded-full h-2">
                                <div 
                                    className="bg-primary h-full transition-all"
                                    style={{ width: `${percentageSelected}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Línea divisoria sin márgenes */}
                    <hr className="h-px w-full m-0 p-0 border-0 bg-border" />
                    
                    {/* Contenido - usamos div en lugar de CardContent */}
                    <div className="p-6">
                        <form onSubmit={handleSubmit} id="permissions-form">
                            <div className="grid gap-4">
                                {Object.entries(groupedPermissions).map(([group, groupPerms]) => (
                                    <motion.div
                                        key={group}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className={cn(
                                            "border transition-colors duration-300",
                                            isGroupChecked(groupPerms) ? "border-primary/50 bg-primary/5" : ""
                                        )}>
                                            <CardHeader 
                                                className="pb-2 cursor-pointer hover:bg-muted/30"
                                                onClick={() => toggleGroupExpansion(group)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox 
                                                            id={`group-${group}`}
                                                            checked={isGroupChecked(groupPerms)}
                                                            data-state={isGroupIndeterminate(groupPerms) ? 'indeterminate' : isGroupChecked(groupPerms) ? 'checked' : 'unchecked'}
                                                            onCheckedChange={(checked) => {
                                                                handleGroupToggle(groupPerms, !!checked);
                                                                // Evita que el evento se propague y active el toggle de expansión
                                                                event?.stopPropagation();
                                                            }}
                                                            className="h-5 w-5"
                                                        />
                                                        <div>
                                                            <CardTitle className="capitalize text-base mb-0">
                                                                {formatGroupName(group)}
                                                            </CardTitle>
                                                            <Progress 
                                                                value={getGroupProgress(groupPerms)} 
                                                                className="h-1 w-40 mt-1" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline">
                                                        {Array.isArray(groupPerms) 
                                                            ? groupPerms.filter(permission => data.permissions.includes(permission.id)).length 
                                                            : 0}
                                                        /{Array.isArray(groupPerms) ? groupPerms.length : 0}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            
                                            {expandedGroups[group] && Array.isArray(groupPerms) && groupPerms.length > 0 && (
                                                <CardContent>
                                                    <motion.div 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2"
                                                    >
                                                        {groupPerms.map(permission => {
                                                            const isChecked = data.permissions.includes(permission.id);
                                                            
                                                            return (
                                                                <motion.div 
                                                                    key={permission.id}
                                                                    whileHover={{ scale: 1.01 }}
                                                                    className={cn(
                                                                        "flex items-center space-x-2 p-3 rounded-md border",
                                                                        isChecked ? "border-primary bg-primary/5" : "border-muted bg-card"
                                                                    )}
                                                                >
                                                                    <Checkbox 
                                                                        id={`permission-${permission.id}`} 
                                                                        checked={isChecked}
                                                                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                                        className={cn(
                                                                            "h-4 w-4",
                                                                            isChecked ? "text-primary border-primary" : ""
                                                                        )}
                                                                    />
                                                                    <label 
                                                                        htmlFor={`permission-${permission.id}`}
                                                                        className={cn(
                                                                            "text-sm font-medium capitalize leading-none flex-1 cursor-pointer",
                                                                            isChecked ? "text-primary" : "text-foreground"
                                                                        )}
                                                                    >
                                                                        {formatPermissionName(permission.name)}
                                                                    </label>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </motion.div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </form>
                    </div>
                    
                    {/* Footer - usamos div en lugar de CardFooter */}
                    <div className="flex justify-between p-4 border-t bg-muted/20 mt-auto">
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => router.visit(route('admin.roles.index'))}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Button>
                        <Button 
                            type="submit"
                            form="permissions-form"
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
