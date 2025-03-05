'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    OnChangeFn,
    PaginationState,
    SortingState,
    TableOptions,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { useState } from 'react';

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
    onSearch?: (searchTerm: string) => void; // Nueva propiedad para la función de búsqueda
}

export function DataTable<TData, TValue>({
    data,
    columns,
    pagination = true,
    filtering = true,
    paginationInfo,
    onPaginationChange,
    onSearch,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Función que maneja los cambios en el campo de búsqueda
    const handleSearchChange = (value: string) => {
        setGlobalFilter(value);

        // Si se proporcionó una función de búsqueda externa, la llamamos
        if (onSearch) {
            onSearch(value);
        }
    };

    // Creamos el objeto tableConfig de manera condicional con tipo específico
    const tableConfig: TableOptions<TData> = {
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
    };

    // Si no hay una función de búsqueda externa, usamos el filtrado interno
    if (!onSearch) {
        tableConfig.getFilteredRowModel = getFilteredRowModel();
        tableConfig.onGlobalFilterChange = setGlobalFilter;
    }

    if (paginationInfo) {
        tableConfig.pageCount = paginationInfo.pageCount;
        tableConfig.state = {
            pagination: {
                pageIndex: paginationInfo.pageIndex,
                pageSize: paginationInfo.pageSize,
            },
            sorting,
            globalFilter: onSearch ? undefined : globalFilter,
        };
        tableConfig.manualPagination = true;
        tableConfig.onPaginationChange = onPaginationChange;
    } else {
        tableConfig.getPaginationRowModel = getPaginationRowModel();
        tableConfig.onPaginationChange = setPagination;
        tableConfig.state = {
            pagination: { pageIndex, pageSize },
            sorting,
            globalFilter: onSearch ? undefined : globalFilter,
        };
    }

    const table = useReactTable(tableConfig);

    return (
        <div className="border-border/50 w-full overflow-hidden rounded-xl border shadow-sm">
            {/* Encabezado con filtro */}
            {filtering && (
                <div className="border-border/30 flex items-center justify-between space-x-4 border-b px-4 py-3">
                    <div className="relative max-w-md flex-grow">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Input
                                        placeholder="Buscar..."
                                        value={globalFilter ?? ''}
                                        onChange={(e) => handleSearchChange(String(e.target.value))}
                                        className="focus:ring-primary/20 rounded-lg py-2 pl-10 shadow-sm transition-all focus:ring-2"
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

            {/* Tabla con scroll horizontal suave */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/30">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-muted/40">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-4 py-3 font-semibold">
                                        {header.isPlaceholder ? null : (
                                            <Button
                                                variant="ghost"
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="w-full justify-start hover:bg-transparent"
                                            >
                                                <span className="flex items-center gap-2">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    <span className="text-muted-foreground">
                                                        {header.column.getIsSorted() === false && <ArrowUpDown className="h-4 w-4" />}
                                                        {header.column.getIsSorted() === 'asc' && <ArrowUp className="h-4 w-4" />}
                                                        {header.column.getIsSorted() === 'desc' && <ArrowDown className="h-4 w-4" />}
                                                    </span>
                                                </span>
                                            </Button>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/40 transition-colors duration-100">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            {(pagination || paginationInfo) && (
                <div className="border-border/30 flex items-center justify-between border-t px-4 py-3">
                    <div className="text-muted-foreground text-sm">
                        Mostrando {table.getFilteredRowModel().rows.length === 0 ? 0 : pageIndex * pageSize + 1} a{' '}
                        {Math.min((pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length)} de {table.getFilteredRowModel().rows.length}{' '}
                        resultados
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Selector de filas por página */}
                        <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground text-sm">Filas:</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                table.setPageSize(Number(e.target.value));
                                            }}
                                            className="border-input bg-background focus:ring-primary/20 h-8 w-16 rounded-md border px-2 text-sm focus:ring-2"
                                        >
                                            {[10, 20, 30, 40, 50].map((pageSize) => (
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

                        {/* Controles de navegación de páginas */}
                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => table.setPageIndex(0)}
                                            disabled={!table.getCanPreviousPage()}
                                            className="h-8 w-8 rounded-md"
                                        >
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
                                            size="icon"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                            className="h-8 w-8 rounded-md"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Página anterior</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <span className="text-muted-foreground text-sm">
                                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                            </span>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                            className="h-8 w-8 rounded-md"
                                        >
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
                                            size="icon"
                                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                            disabled={!table.getCanNextPage()}
                                            className="h-8 w-8 rounded-md"
                                        >
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

export default DataTable;
