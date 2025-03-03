import { NavItem } from '@/types';
import { BookOpen, BookOpenCheck, FileText, Folder, GraduationCap, LayoutGrid, Settings, UserCog, Users, LineChart, BarChartHorizontal } from 'lucide-react';

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
            {
                title: 'Analytics',
                icon: LineChart,
                roles: ['admin'],
                comingSoon: true,
            },
            {
                title: 'Reports',
                icon: BarChartHorizontal,
                roles: ['admin'],
                comingSoon: true,
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
                comingSoon: true,
            },
            {
                title: 'Estudiantes',
                url: '/students',
                icon: BookOpenCheck,
                comingSoon: true,
            },
            {
                title: 'Calificaciones',
                icon: LineChart,
                comingSoon: true,
            },
        ],
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Repositorio',
        url: 'https://github.com/Angelito-Systems/Dashboard-Template-Laravel-12-Inertia-React',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
        comingSoon: true,
    },
];
