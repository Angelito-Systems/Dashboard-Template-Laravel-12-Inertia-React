import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Role, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCircle, Loader2, Save } from 'lucide-react';
import { router } from '@inertiajs/react';
import { alerts } from '@/lib/alerts';
import { useEffect } from 'react';

// Esquema de validación para el formulario
const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  email: z.string().email({
    message: "Correo electrónico inválido",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }).optional().or(z.literal('')),
  roles: z.array(z.number()).min(1, {
    message: "Debe seleccionar al menos un rol",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User & { roles?: Role[] }; // Optional para creación
  roles: Role[];
}

export function UserFormModal({ open, onOpenChange, user, roles }: UserFormModalProps) {
  const isEditing = !!user;
  
  // Inicializamos el formulario con los datos del usuario si estamos editando
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '', // Siempre vacío por seguridad
      roles: user?.roles?.map(role => role.id) || [],
    },
  });

  // Actualizamos los valores del formulario cuando cambia el usuario
  useEffect(() => {
    if (open) {
      form.reset({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        roles: user?.roles?.map(role => role.id) || [],
      });
    }
  }, [user, open, form]);

  const onSubmit = (data: FormData) => {
    // Eliminamos la contraseña si está vacía y estamos editando
    const formData = { ...data };
    if (isEditing && !formData.password) {
      delete formData.password;
    }

    if (isEditing) {
      // Actualizar usuario existente
      router.put(route('admin.users.update', user.id), formData, {
        onSuccess: () => {
          alerts.success('Usuario actualizado', 'El usuario ha sido actualizado correctamente');
          onOpenChange(false); // Cerrar modal
        },
        onError: (errors) => {
          alerts.error('Error', 'Ha ocurrido un error al actualizar el usuario');
          console.error(errors);
        },
      });
    } else {
      // Crear nuevo usuario
      router.post(route('admin.users.store'), formData, {
        onSuccess: () => {
          alerts.success('Usuario creado', 'El usuario ha sido creado correctamente');
          onOpenChange(false); // Cerrar modal
        },
        onError: (errors) => {
          alerts.error('Error', 'Ha ocurrido un error al crear el usuario');
          console.error(errors);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? `Editar Usuario: ${user.name}` : 'Crear Nuevo Usuario'}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? 'Actualiza la información del usuario existente'
                  : 'Ingresa los datos para crear un nuevo usuario en el sistema'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="usuario@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing
                      ? "Contraseña (dejar en blanco para no cambiar)"
                      : "Contraseña"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Roles</FormLabel>
              <div className="grid grid-cols-2 gap-3 border rounded-md p-4 bg-muted/10">
                {roles.map((role) => (
                  <FormField
                    key={role.id}
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(role.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), role.id]);
                              } else {
                                field.onChange(
                                  field.value?.filter((id: number) => id !== role.id) || []
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal mt-0">
                          {role.name}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage>{form.formState.errors.roles?.message}</FormMessage>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex items-center gap-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
