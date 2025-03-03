import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Role, Permission } from '@/types';
import { Save, ArrowLeft } from 'lucide-react';
import { alerts } from '@/lib/alerts';

interface RoleFormProps extends PageProps {
  role?: Role;
  permissions: Permission[];
}

export default function RoleForm({ role, permissions }: RoleFormProps) {
  const isEditing = !!role;
  
  const { data, setData, post, put, processing, errors } = useForm({
    name: role?.name || '',
    permissions: role?.permissions?.map(p => p.id) || []
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Roles',
      href: route('admin.roles.index'),
    },
    {
      title: isEditing ? 'Editar Rol' : 'Crear Rol',
      href: isEditing 
        ? route('admin.roles.edit', role.id) 
        : route('admin.roles.create'),
    },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (isEditing) {
      put(route('admin.roles.update', role.id), {
        onSuccess: () => {
          alerts.success('Rol actualizado', `El rol "${data.name}" ha sido actualizado correctamente.`);
          router.visit(route('admin.roles.index'));
        },
        onError: (errors) => {
          const errorMessage = errors.name || "Ha ocurrido un error al actualizar el rol.";
          alerts.error("Error", errorMessage);
        }
      });
    } else {
      post(route('admin.roles.store'), {
        onSuccess: () => {
          alerts.success('Rol creado', `El rol "${data.name}" ha sido creado correctamente.`);
          router.visit(route('admin.roles.index'));
        },
        onError: (errors) => {
          const errorMessage = errors.name || "Ha ocurrido un error al crear el rol.";
          alerts.error("Error", errorMessage);
        }
      });
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEditing ? `Editar Rol: ${role.name}` : 'Crear Rol'} />
      
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{isEditing ? `Editar Rol: ${role.name}` : 'Crear Nuevo Rol'}</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Actualiza la información del rol seleccionado.' 
                : 'Completa la información para crear un nuevo rol en el sistema.'}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Rol</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  placeholder="Ej: Editor, Analista, Supervisor..."
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
              
              {/* Nota: La gestión de permisos tiene su propia vista dedicada, así que 
                  no incluimos la selección de permisos aquí. Se hace en /roles/{id}/permissions */}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.visit(route('admin.roles.index'))}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Actualizar Rol' : 'Crear Rol'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
