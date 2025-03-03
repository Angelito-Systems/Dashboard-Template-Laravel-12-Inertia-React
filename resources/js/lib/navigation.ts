import { NavItem } from '@/types';
import { BookOpen, BookOpenCheck, FileText, Folder, GraduationCap, LayoutGrid, Settings, UserCog, Users } from 'lucide-react';

export const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/',
        icon: LayoutGrid,
        roles: ['admin'],
        type: 'item',
    },
    {
        title: 'Administración',
        icon: Settings,
        type: 'dropdown',
        roles: ['admin'],
        items: [
            {
                title: 'Usuarios',
                url: '/admin/users',
                icon: Users,
                roles: ['admin'],
            },
            {
                title: 'Roles',
                url: '/admin/roles',
                icon: UserCog,
                roles: ['admin'],
            },
            {
                title: 'Permisos',
                url: '/admin/permissions',
                icon: FileText,
                roles: ['admin'],
            },
        ],
    },
];

export const instructorNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: LayoutGrid,
        roles: ['instructor'],
        type: 'item',
    },
    {
        title: 'Gestión Académica',
        icon: GraduationCap,
        type: 'dropdown',
        roles: ['instructor'],
        items: [
            {
                title: 'Mis Cursos',
                url: '/courses',
                icon: FileText,
            },
            {
                title: 'Estudiantes',
                url: '/students',
                icon: BookOpenCheck,
            },
        ],
    },
];


export const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     url: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     url: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];