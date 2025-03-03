import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, User, Role } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CirclePlus, Edit, Trash, UserCircle2, RefreshCw } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { alerts } from '@/lib/alerts';
import { useState, useCallback } from 'react';
import { UserFormModal } from '@/components/admin/users/user-form-modal';

// Actualizar la interfaz para incluir roles y usuario seleccionado
interface UsersPageProps extends PageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
        links?: Array<{url: string|null, label: string, active: boolean}>;
    };
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: route('admin.users.index'),
    },
];

export default function Index({ users, roles }: UsersPageProps) {
    // Estado para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    
    // Función para cerrar el modal y limpiar la selección
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Damos tiempo a la animación de cierre antes de limpiar el usuario
        setTimeout(() => setSelectedUser(null), 300);
    };
    
    // Función para abrir el modal para editar
    const handleEdit = useCallback((user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    }, []);
    
    // Función para abrir el modal para crear
    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };
    
    const columns: ColumnDef<User, unknown>[] = [
        {
            header: 'Nombre',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <UserCircle2 className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">{row.original.email}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Rol',
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.roles?.map((role) => (
                        <Badge key={role.id} variant="secondary">
                            {role.name}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            header: 'Estado',
            cell: ({ row }) => (
                <Badge variant={row.original.email_verified_at ? "success" : "warning"}>
                    {row.original.email_verified_at ? "Verificado" : "Pendiente"}
                </Badge>
            ),
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
                                    onClick={() => handleEdit(row.original)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Editar usuario</p>
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
                                <p>Eliminar usuario</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    const handleDelete = (id: number, name: string) => {
        alerts.warning(
            "Confirmar eliminación", 
            `¿Estás seguro de que deseas eliminar al usuario "${name}"?`,
            {
                action: {
                    label: "Eliminar",
                    onClick: () => {
                        router.delete(route('admin.users.destroy', id), {
                            onSuccess: () => {
                                alerts.success("Usuario eliminado", `El usuario "${name}" ha sido eliminado correctamente.`);
                            },
                            onError: () => {
                                alerts.error("Error al eliminar", "No se pudo eliminar el usuario.");
                            }
                        });
                    }
                }
            }
        );
    };
    
    // Función para recargar los datos con preserveState
    const refreshData = () => {
        router.reload({ only: ['users'] });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            
            {/* Modal de Creación/Edición */}
            <UserFormModal 
                open={isModalOpen}
                onOpenChange={handleCloseModal}
                user={selectedUser as User & { roles: Role[] }}
                roles={roles}
            />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-foreground text-2xl font-semibold">Usuarios</h2>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={refreshData}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span className="hidden sm:inline">Recargar</span>
                        </Button>
                        <Button 
                            variant="default" 
                            onClick={handleCreate}
                            className="flex items-center gap-2"
                        >
                            <CirclePlus className="h-4 w-4" />
                            <span>Nuevo Usuario</span>
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    <DataTable 
                        data={users.data} 
                        columns={columns} 
                        pagination={true}
                        filtering={true}
                        paginationInfo={{
                            pageCount: users.last_page,
                            pageIndex: users.current_page - 1,
                            pageSize: users.per_page,
                            rowCount: users.total,
                        }}
                        onPaginationChange={(newPagination) => {
                            // Corregido: verificamos si tenemos un objeto o una función actualizadora
                            const getPageIndex = typeof newPagination === 'function' 
                                ? newPagination({ pageIndex: 0, pageSize: 10 }).pageIndex
                                : newPagination.pageIndex;
                                
                            const nextPage = getPageIndex + 1;
                            router.get(route('admin.users.index', {
                                page: nextPage
                            }), {}, { preserveState: true });
                        }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
