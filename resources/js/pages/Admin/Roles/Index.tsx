import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CirclePlus, Edit, Trash, Key } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import RoleFormModal from '@/components/admin/roles/role-form-modal';
import { alerts } from '@/lib/alerts';

interface RolesPageProps extends PageProps {
    roles: Role[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lista de Roles',
        href: '/admin/roles',
    },
];

export default function Index({ roles, flash }: RolesPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    
    // Mostrar mensajes flash del servidor si existen
    if (flash?.success) {
        alerts.success("Operación exitosa", flash.success);
    }
    
    if (flash?.error) {
        alerts.error("Error", flash.error);
    }
    
    const openCreateModal = () => {
        setEditingRole(null);
        setIsModalOpen(true);
    };
    
    const openEditModal = (role: Role) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRole(null);
    };
    
    const handleFormSubmit = (data: { name: string }, roleId?: number) => {
        if (roleId) {
            // Actualizar rol existente
            router.put(route('admin.roles.update', roleId), data, {
                onSuccess: () => {
                    alerts.success(
                        "Rol actualizado", 
                        `El rol "${data.name}" ha sido actualizado correctamente.`
                    );
                    closeModal();
                },
                onError: (errors) => {
                    const errorMessage = errors.name || "Ha ocurrido un error al actualizar el rol.";
                    alerts.error("Error al actualizar", errorMessage);
                }
            });
        } else {
            // Crear nuevo rol
            router.post(route('admin.roles.store'), data, {
                onSuccess: () => {
                    alerts.success(
                        "Rol creado", 
                        `El rol "${data.name}" ha sido creado correctamente.`
                    );
                    closeModal();
                },
                onError: (errors) => {
                    const errorMessage = errors.name || "Ha ocurrido un error al crear el rol.";
                    alerts.error("Error al crear", errorMessage);
                }
            });
        }
    };

    const columns: ColumnDef<Role, unknown>[] = [
        {
            header: 'Nombre',
            accessorKey: 'name',
        },
        {
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => openEditModal(row.original)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Editar rol</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={route('admin.roles.permissions.edit', row.original.id)}>
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                        <Key className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Gestionar permisos</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(row.original.id, row.original.name)}
                                    className="h-8 w-8 p-0 border-destructive text-destructive hover:bg-destructive hover:text-white"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Eliminar rol</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    const handleDelete = (id: number, roleName: string) => {
        alerts.warning(
            "Confirmar eliminación", 
            `¿Estás seguro de que deseas eliminar el rol "${roleName}"?`, 
            {
                action: {
                    label: "Eliminar",
                    onClick: () => {
                        router.delete(route('admin.roles.destroy', id), {
                            onSuccess: () => {
                                alerts.success("Rol eliminado", `El rol "${roleName}" ha sido eliminado correctamente.`);
                            },
                            onError: () => {
                                alerts.error(
                                    "Error al eliminar", 
                                    "No se pudo eliminar el rol. Puede que esté asociado a usuarios."
                                );
                            }
                        });
                    }
                }
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-foreground text-2xl font-semibold">Roles</h2>
                    <Button 
                        variant="default" 
                        className="flex items-center gap-2"
                        onClick={openCreateModal}
                    >
                        <CirclePlus className="h-4 w-4" />
                        <span>Nuevo Rol</span>
                    </Button>
                </div>

                <DataTable 
                    data={roles} 
                    columns={columns} 
                    pagination={true}
                    filtering={true}
                />
                
                <RoleFormModal 
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleFormSubmit}
                    role={editingRole}
                />
            </div>
        </AppLayout>
    );
}
