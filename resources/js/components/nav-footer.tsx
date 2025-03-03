import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { cn } from '@/lib/utils';

interface NavFooterProps {
    items: NavItem[];
    className?: string;
}

export function NavFooter({ items, className }: NavFooterProps) {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        <div className={cn('flex flex-col gap-1 py-2', isCollapsed ? 'px-2' : 'px-3', className)}>
            {items.map((item, index) => (
                <div key={index}>
                    {item.comingSoon ? (
                        isCollapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 opacity-60"
                                        disabled
                                    >
                                        {item.icon && <item.icon className="h-4 w-4 text-muted-foreground/70" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="flex items-center gap-2">
                                    <span>{item.title}</span>
                                    <Badge variant="outline" className="text-[10px] py-0 h-4">Próximamente</Badge>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button
                                variant="ghost"
                                className="h-9 w-full justify-start opacity-60 text-muted-foreground/70"
                                disabled
                            >
                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                {item.title}
                                <Badge variant="outline" className="ml-auto text-[10px] py-0 h-4">Próximamente</Badge>
                            </Button>
                        )
                    ) : (
                        <Button
                            variant="ghost"
                            size={isCollapsed ? 'icon' : 'default'}
                            className={cn('h-9', isCollapsed ? 'w-9' : 'w-full justify-start')}
                            asChild
                        >
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.icon && <item.icon className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />}
                                {!isCollapsed && item.title}
                            </a>
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}
