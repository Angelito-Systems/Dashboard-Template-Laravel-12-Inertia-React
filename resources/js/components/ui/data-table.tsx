"use client"

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    type ColumnDef,
    useReactTable,
    SortingState,
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, 
    ChevronRight, 
    ChevronsLeft, 
    ChevronsRight,
    Search,
    ArrowUp,
    ArrowDown,
    ArrowUpDown
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

interface DataTableProps<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    pagination?: boolean;
    filtering?: boolean;
    pageCount?: number;
    paginationInfo?: {
        pageCount: number;
        pageIndex: number;
        pageSize: number;
        rowCount: number;
    };
    onPaginationChange?: OnChangeFn<PaginationState>;
}

export function DataTable<TData, TValue>({ 
    data, 
    columns, 
    pagination = true,
    filtering = true,
    paginationInfo,
    onPaginationChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const tableConfig = {
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
    };

    if (paginationInfo) {
        // Configuración para paginación del servidor
        Object.assign(tableConfig, {
            pageCount: paginationInfo.pageCount,
            state: {
                pagination: {
                    pageIndex: paginationInfo.pageIndex,
                    pageSize: paginationInfo.pageSize,
                },
                sorting,
                globalFilter,
            },
            manualPagination: true,
            onPaginationChange,
        });
    } else {
        // Configuración para paginación del cliente
        Object.assign(tableConfig, {
            getPaginationRowModel: getPaginationRowModel(),
            onPaginationChange: setPagination,
            state: {
                pagination: { pageIndex, pageSize },
                sorting,
                globalFilter,
            },
        });
    }

    const table = useReactTable(tableConfig);

    return (
        <div className="flex flex-col gap-4">
            {filtering && (
                <div className="flex items-center">
                    <div className="relative w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Input
                                        placeholder="Buscar..."
                                        value={globalFilter ?? ''}
                                        onChange={(e) => setGlobalFilter(String(e.target.value))}
                                        className="pl-8"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Buscar en todas las columnas</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            )}

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            className="hover:bg-muted/50"
                                                        >
                                                            <span className="flex items-center">
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                                <span className="ml-1.5">
                                                                    {header.column.getIsSorted() === false && (
                                                                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                                                    )}
                                                                    {header.column.getIsSorted() === "asc" && (
                                                                        <ArrowUp className="h-4 w-4" />
                                                                    )}
                                                                    {header.column.getIsSorted() === "desc" && (
                                                                        <ArrowDown className="h-4 w-4" />
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Ordenar por este campo</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {(pagination || paginationInfo) && (
                <div className="flex items-center justify-between px-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Mostrando {table.getFilteredRowModel().rows.length === 0 ? 0 : pageIndex * pageSize + 1} a {Math.min((pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length)} de {table.getFilteredRowModel().rows.length} resultados
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Filas por página</p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <select
                                            value={pageSize}
                                            onChange={e => {
                                                table.setPageSize(Number(e.target.value));
                                            }}
                                            className="h-8 w-[70px] rounded-md border border-input bg-background px-2"
                                        >
                                            {[10, 20, 30, 40, 50].map(pageSize => (
                                                <option key={pageSize} value={pageSize}>
                                                    {pageSize}
                                                </option>
                                            ))}
                                        </select>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cambiar número de filas</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="hidden h-8 w-8 p-0 lg:flex"
                                            onClick={() => table.setPageIndex(0)}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            <span className="sr-only">Ir a la primera página</span>
                                            <ChevronsLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Primera página</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-8 w-8 p-0"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            <span className="sr-only">Ir a la página anterior</span>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Página anterior</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <div className="flex items-center gap-1">
                                <span className="text-sm font-medium">
                                    Página {table.getState().pagination.pageIndex + 1} de{' '}
                                    {table.getPageCount()}
                                </span>
                            </div>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-8 w-8 p-0"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            <span className="sr-only">Ir a la página siguiente</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Página siguiente</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="hidden h-8 w-8 p-0 lg:flex"
                                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            <span className="sr-only">Ir a la última página</span>
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Última página</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
