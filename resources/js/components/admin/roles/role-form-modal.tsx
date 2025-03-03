import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { showAlert } from '@/lib/alerts';
import { cn } from '@/lib/utils';
import { Role } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Shield } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'El nombre del rol debe tener al menos 3 caracteres.' })
        .max(50, { message: 'El nombre del rol no debe exceder los 50 caracteres.' })
        .refine((value) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value), {
            message: 'El nombre solo puede contener letras y espacios.',
        }),
});

type FormData = z.infer<typeof formSchema>;

interface RoleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData, roleId?: number) => void;
    role: Role | null;
}

export default function RoleFormModal({ isOpen, onClose, onSubmit, role }: RoleFormModalProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: role?.name || '',
        },
    });

    // Actualizar valores del formulario cuando cambie el rol seleccionado
    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: role?.name || '',
            });
        }
    }, [role, form, isOpen]);

    const handleSubmit = async (data: FormData) => {
        try {
            onSubmit(data, role?.id);
        } catch (error: unknown) {
            // Mensaje de error genérico + manejo de error tipado
            const errorMessage = error instanceof Error ? error.message : 'Ha ocurrido un problema al procesar tu solicitud.';
            
            showAlert({
                type: 'error',
                title: 'Error al guardar el rol',
                description: errorMessage,
            });
        }
    };

    // Cerrar el modal correctamente y reiniciar el formulario
    const handleClose = () => {
        form.reset();
        onClose();
    };

    const isCreating = !role;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-full p-2">
                            <Shield className="text-primary h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle>{isCreating ? 'Crear nuevo rol' : 'Editar rol'}</DialogTitle>
                            <DialogDescription>
                                {isCreating ? 'Introduce el nombre para el nuevo rol' : 'Actualiza el nombre del rol'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del rol</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. Editor, Administrador..."
                                            className={cn(
                                                'w-full',
                                                form.formState.errors.name && 'border-destructive focus-visible:ring-destructive',
                                            )}
                                            autoFocus
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6 gap-2 sm:justify-between">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={form.formState.isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="flex items-center gap-2">
                                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {isCreating ? 'Crear rol' : 'Guardar cambios'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
