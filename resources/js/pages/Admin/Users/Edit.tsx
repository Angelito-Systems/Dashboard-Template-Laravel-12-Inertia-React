import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Role, User } from '@/types';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, ArrowLeft } from 'lucide-react';
import { alerts } from '@/lib/alerts';

interface EditUserProps extends PageProps {
    user: User & { roles: Role[] };
    roles: Role[];
}

const formSchema = z.object({
    name: z.string().min(3, {
        message: "El nombre debe tener al menos 3 caracteres",
    }),
    email: z.string().email({
        message: "Correo electrónico inválido",
    }),
    password: z.string().optional(),
    roles: z.array(z.number()).min(1, {
        message: "Debe seleccionar al menos un rol",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function Edit({ user, roles }: EditUserProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Usuarios', href: route('admin.users.index') },
        { title: `Editar: ${user.name}`, href: route('admin.users.edit', user.id) },
    ];

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            password: '',
            roles: user.roles.map(role => role.id),
        },
    });

    const onSubmit = (data: FormData) => {
        // Si el campo de contraseña está vacío, no lo enviamos
        const formData = {...data};
        if (!formData.password) {
            delete formData.password;
        }

        router.put(route('admin.users.update', user.id), formData, {
            onSuccess: () => {
                alerts.success('Usuario actualizado', 'El usuario ha sido actualizado correctamente');
            },
            onError: (errors) => {
                alerts.error('Error', 'Ha ocurrido un error al actualizar el usuario');
                console.error(errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Usuario: ${user.name}`} />

            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Editar Usuario</CardTitle>
                        <CardDescription>
                            Modifica la información del usuario {user.name}.
                        </CardDescription>
                    </CardHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre del usuario" {...field} />
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
                                            <FormLabel>Contraseña (dejar en blanco para no cambiar)</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Nueva contraseña (opcional)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-2">
                                    <FormLabel>Roles</FormLabel>
                                    <div className="grid grid-cols-2 gap-3">
                                        {roles.map((role) => (
                                            <FormField
                                                key={role.id}
                                                control={form.control}
                                                name="roles"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value.includes(role.id)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        field.onChange([...field.value, role.id]);
                                                                    } else {
                                                                        field.onChange(field.value.filter((id: number) => id !== role.id));
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
                            </CardContent>

                            <CardFooter className="flex justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route('admin.users.index'))}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar Cambios
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}
