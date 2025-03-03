import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Role } from '@/types';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, ArrowLeft } from 'lucide-react';
import { alerts } from '@/lib/alerts';

interface CreateUserProps extends PageProps {
    roles: Role[];
}

const formSchema = z.object({
    name: z.string().min(3, {
        message: "El nombre debe tener al menos 3 caracteres",
    }),
    email: z.string().email({
        message: "Correo electrónico inválido",
    }),
    password: z.string().min(8, {
        message: "La contraseña debe tener al menos 8 caracteres",
    }),
    roles: z.array(z.number()).min(1, {
        message: "Debe seleccionar al menos un rol",
    }),
});

type FormData = z.infer<typeof formSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: route('admin.users.index') },
    { title: 'Crear Usuario', href: route('admin.users.create') },
];

export default function Create({ roles }: CreateUserProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            roles: [],
        },
    });

    const onSubmit = (data: FormData) => {
        router.post(route('admin.users.store'), data, {
            onSuccess: () => {
                alerts.success('Usuario creado', 'El usuario ha sido creado correctamente');
            },
            onError: (errors) => {
                // Los errores de validación ya se muestran automáticamente en los campos
                alerts.error('Error', 'Ha ocurrido un error al crear el usuario');
                console.error(errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Usuario" />

            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Crear Nuevo Usuario</CardTitle>
                        <CardDescription>
                            Completa la información para crear un nuevo usuario en el sistema.
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
                                            <FormLabel>Contraseña</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
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
                                    Crear Usuario
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}
