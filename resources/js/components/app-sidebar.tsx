import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { adminNavItems, footerNavItems, instructorNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { type NavItem, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AppLogo from './app-logo';
import { Badge } from '@/components/ui/badge';

const NavDropdownItem = ({ item }: { item: NavItem }) => {
    const currentPath = window.location.pathname;
    // Verificar si algún subitem coincide con la ruta actual
    const isActiveRoute = item.items?.some((subItem) => subItem.url === currentPath);
    // Inicializar isOpen como true si estamos en una ruta activa
    const [isOpen, setIsOpen] = useState(isActiveRoute);
    const [showSubItems, setShowSubItems] = useState(false);
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = item.items?.some((subItem) => subItem.url === currentPath);

    if (isCollapsed) {
        return (
            <div ref={dropdownRef} className="relative w-full">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SidebarMenuItem className="flex w-full justify-center">
                            <SidebarMenuButton
                                className={cn(
                                    'flex h-10 w-full items-center justify-center px-0',
                                    isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                                    showSubItems && 'bg-sidebar-accent/50',
                                )}
                                onMouseEnter={() => setShowSubItems(true)}
                                onMouseLeave={() => setShowSubItems(false)}
                            >
                                <div className="flex w-full items-center justify-center">{item.icon && <item.icon className="h-4 w-4" />}</div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </TooltipTrigger>
                    <TooltipContent
                        side="right"
                        className="bg-popover/95 supports-[backdrop-filter]:bg-popover/85 border-border/40 w-52 overflow-hidden rounded-lg border p-0 shadow-lg backdrop-blur"
                        onMouseEnter={() => setShowSubItems(true)}
                        onMouseLeave={() => setShowSubItems(false)}
                    >
                        <div className="flex flex-col">
                            <div className="border-border/40 bg-muted/30 border-b px-3 py-2.5">
                                <div className="flex items-center space-x-2">
                                    {item.icon && <item.icon className="text-muted-foreground h-4 w-4" />}
                                    <span className="text-foreground/90 text-sm font-medium">{item.title}</span>
                                </div>
                            </div>
                            <div className="py-1.5">
                                {item.items?.map((subItem, index) => {
                                    const isSubItemActive = subItem.url === currentPath;
                                    return (
                                        <div key={index} className="relative">
                                            {subItem.comingSoon ? (
                                                <div
                                                    className={cn(
                                                        'text-muted-foreground/60 flex items-center px-3 py-2 text-sm opacity-60 cursor-not-allowed',
                                                    )}
                                                >
                                                    {subItem.icon && (
                                                        <subItem.icon
                                                            className="mr-2 h-4 w-4 text-muted-foreground/60"
                                                        />
                                                    )}
                                                    <span>{subItem.title}</span>
                                                    <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4">Próximamente</Badge>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={subItem.url || ''}
                                                    className={cn(
                                                        'text-muted-foreground hover:text-foreground flex items-center px-3 py-2 text-sm',
                                                        'hover:bg-accent/50 transition-all duration-200',
                                                        'after:bg-accent/0 hover:after:bg-accent/40 relative after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[1px]',
                                                        isSubItemActive && 'bg-accent/40 text-foreground after:bg-accent/60 font-medium',
                                                    )}
                                                >
                                                    {subItem.icon && (
                                                        <subItem.icon
                                                            className={cn(
                                                                'mr-2 h-4 w-4 transition-colors',
                                                                isSubItemActive ? 'text-foreground' : 'text-muted-foreground',
                                                            )}
                                                        />
                                                    )}
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }

    // Renderizado normal para sidebar expandido
    return (
        <SidebarMenuItem className="overflow-hidden">
            <SidebarMenuButton onClick={() => setIsOpen(!isOpen)} className={isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}>
                {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                <span className="truncate">{item.title}</span>
                <svg
                    className={`ml-auto h-3 w-3 shrink-0 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </SidebarMenuButton>
            {isOpen && item.items && (
                <SidebarMenu className="mt-2 ml-4 w-[calc(100%-1rem)]">
                    {item.items.map((subItem, index) => {
                        const isSubItemActive = subItem.url === currentPath;
                        return (
                            <SidebarMenuItem key={index}>
                                {subItem.comingSoon ? (
                                    <div className="flex w-full items-center opacity-60 text-muted-foreground/70 px-3 py-2 cursor-not-allowed">
                                        {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0 mr-2" />}
                                        <span className="truncate">{subItem.title}</span>
                                        <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4">Próximamente</Badge>
                                    </div>
                                ) : (
                                    <SidebarMenuButton
                                        asChild
                                        className={cn('w-full', isSubItemActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium')}
                                    >
                                        <Link href={subItem.url || ''} className="flex w-full items-center">
                                            {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0" />}
                                            <span className="truncate">{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            )}
        </SidebarMenuItem>
    );
};

const NavMainItem = ({ item }: { item: NavItem }) => {
    const currentPath = window.location.pathname;
    const isActive = item.url === currentPath;
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    if (item.type === 'dropdown') {
        return <NavDropdownItem item={item} />;
    }

    if (item.comingSoon) {
        return (
            <SidebarMenuItem className={cn(isCollapsed && 'flex w-full justify-center')}>
                <div 
                    className={cn(
                        'flex items-center px-3 py-2 opacity-60 text-muted-foreground/70 cursor-not-allowed',
                        isCollapsed && 'h-10 w-full justify-center',
                    )}
                >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {!isCollapsed && (
                        <>
                            <span className="ml-2 mr-1">{item.title}</span>
                            <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4">Próximamente</Badge>
                        </>
                    )}
                </div>
            </SidebarMenuItem>
        );
    }

    return (
        <SidebarMenuItem className={cn(isCollapsed && 'flex w-full justify-center')}>
            <SidebarMenuButton
                asChild
                className={cn(
                    'flex items-center',
                    isCollapsed && 'h-10 w-full justify-center',
                    isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                )}
            >
                <Link href={item.url || ''} className="flex w-full items-center">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {!isCollapsed && <span className="ml-2">{item.title}</span>}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;

    // El usuario puede tener roles como array de objetos o como array de strings
    let userRoles: string[] = [];

    // Verificar la estructura de los roles y extraer los nombres
    if (auth.user && auth.user.roles) {
        if (typeof auth.user.roles[0] === 'string') {
            // Si los roles ya son strings, usarlos directamente
            userRoles = auth.user.roles as unknown as string[];
        } else if (typeof auth.user.roles[0] === 'object') {
            // Si los roles son objetos, extraer sus nombres
            userRoles = (auth.user.roles as unknown as { name: string }[]).map((role) => role.name);
        }
    }

    const hasRequiredRole = (requiredRoles?: string[]) => {
        // Si no hay roles requeridos, permitir acceso
        if (!requiredRoles || requiredRoles.length === 0) return true;

        // Verificar si el usuario tiene alguno de los roles requeridos
        const hasRole = requiredRoles.some((role) => userRoles.includes(role));
        return hasRole;
    };

    const getAuthorizedItems = (items: NavItem[]): NavItem[] => {
        return items.filter((item) => {
            // Verificar la autorización del item actual
            const isAuthorized = hasRequiredRole(item.roles);

            // Si el item tiene subitems, procesarlos
            if (item.items) {
                item.items = getAuthorizedItems(item.items);
                const hasAuthorizedChildren = item.items.length > 0;
                // Mostrar el item si está autorizado o tiene hijos autorizados
                return isAuthorized || hasAuthorizedChildren;
            }
            return isAuthorized;
        });
    };

    const allNavItems = [...adminNavItems, ...instructorNavItems]; // Incluimos instructorNavItems para mostrarlos según el rol
    const authorizedItems = getAuthorizedItems(allNavItems);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {authorizedItems.map((item, index) => (
                        <NavMainItem key={index} item={item} />
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
