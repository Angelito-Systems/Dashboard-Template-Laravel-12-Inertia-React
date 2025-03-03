import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table'; // Importamos desde data-table
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Permission } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleX } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface PermissionsPageProps extends PageProps {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lista de Permisos',
        href: '/admin/permissions',
    },
];

export default function Index({ permissions }: PermissionsPageProps) {
    // Definimos las columnas con el tipo correcto para la nueva implementación
    const columns: ColumnDef<Permission, unknown>[] = [
        {
            header: 'Nombre',
            accessorKey: 'name',
        },
        {
            header: 'Acciones',
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(row.original.id)}
                                className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                            >
                                <CircleX className="h-4 w-4" strokeWidth={2} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Eliminar permiso</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
    ];

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este permiso?')) {
            router.delete(route('admin.permissions.destroy', id));
        }
    };

    const handleGeneratePermissions = () => {
        router.post(route('admin.permissions.generate'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permisos" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-foreground text-2xl font-semibold">Permisos</h2>
                    <Button variant="default" onClick={handleGeneratePermissions}>
                        Generar Permisos
                    </Button>
                </div>

                <DataTable 
                    data={permissions} 
                    columns={columns} 
                    pagination={true}
                    filtering={true}
                />
            </div>
        </AppLayout>
    );
}
