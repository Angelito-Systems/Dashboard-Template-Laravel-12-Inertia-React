import { AlertTriangle, CheckCircle2, InfoIcon, XCircle } from 'lucide-react';
import React from 'react';
import { toast, ToastT } from 'sonner';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertOptions {
    type: AlertType;
    title: string;
    description?: string;
    duration?: number;
    position?: ToastT['position'];
    action?: {
        label: string;
        onClick: () => void;
    };
    onDismiss?: () => void;
}

// Iconos para los diferentes tipos de alertas con tamaño mejorado
const AlertIcons: Record<AlertType, React.ReactNode> = {
    success: React.createElement(CheckCircle2, { className: 'text-emerald-500 h-6 w-6' }),
    error: React.createElement(XCircle, { className: 'text-rose-500 h-6 w-6' }),
    warning: React.createElement(AlertTriangle, { className: 'text-amber-500 h-6 w-6' }),
    info: React.createElement(InfoIcon, { className: 'text-blue-500 h-6 w-6' }),
};

// Diseño minimalista para las alertas en blanco y negro con acentos de color
const alertStyles: Record<AlertType, string> = {
    success: 'bg-white dark:bg-gray-900 border-l-4 border-l-emerald-500',
    error: 'bg-white dark:bg-gray-900 border-l-4 border-l-rose-500',
    warning: 'bg-white dark:bg-gray-900 border-l-4 border-l-amber-500',
    info: 'bg-white dark:bg-gray-900 border-l-4 border-l-blue-500',
};

// Definimos interfaces para los tipos de toast para evitar errores
interface ToastData {
    id: string | number;
    dismiss: () => void;
}

interface ToastRenderProps extends ToastData {
    visible?: boolean;
}

/**
 * Muestra una alerta personalizada con Sonner
 */
export function showAlert(options: AlertOptions): void {
    const { type = 'info', title, description, duration = 5000, position = 'top-right', action, onDismiss } = options;

    toast.custom(
        (id: string | number) => {
            // Adaptamos el parámetro para que sea compatible con el tipo esperado
            const t: ToastRenderProps = { id, dismiss: () => toast.dismiss(id) };

            return React.createElement(
                'div',
                {
                    className: `flex w-full max-w-sm gap-3 rounded-md border shadow-md ${alertStyles[type]} ${
                        t.visible ? 'animate-in fade-in slide-in-from-right-2' : 'animate-out fade-out slide-out-to-right-2'
                    }`,
                },
                [
                    React.createElement('div', { className: 'flex-shrink-0 flex items-center pl-4', key: 'icon' }, AlertIcons[type]),

                    React.createElement('div', { className: 'flex-1 py-4 pr-4 space-y-1', key: 'content' }, [
                        React.createElement('p', { className: 'font-medium text-gray-900 dark:text-white', key: 'title' }, title),
                        description && React.createElement('p', { className: 'text-sm text-gray-600 dark:text-gray-300', key: 'desc' }, description),

                        action &&
                            React.createElement(
                                'div',
                                { className: 'mt-3', key: 'action' },
                                React.createElement(
                                    'button',
                                    {
                                        onClick: () => {
                                            action.onClick();
                                            toast.dismiss(t.id);
                                        },
                                        className: 'text-sm font-medium text-primary hover:text-primary/80 transition-colors',
                                    },
                                    action.label,
                                ),
                            ),
                    ]),

                    React.createElement(
                        'button',
                        {
                            key: 'closeBtn',
                            onClick: () => {
                                toast.dismiss(t.id);
                                onDismiss?.();
                            },
                            className:
                                'self-start p-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors',
                        },
                        React.createElement(
                            'svg',
                            {
                                className: 'h-4 w-4',
                                xmlns: 'http://www.w3.org/2000/svg',
                                viewBox: '0 0 24 24',
                                fill: 'none',
                                stroke: 'currentColor',
                                strokeWidth: '2',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                            },
                            [
                                React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18', key: 'line1' }),
                                React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18', key: 'line2' }),
                            ],
                        ),
                    ),
                ],
            );
        },
        { duration, position, id: `${type}-${Date.now()}` },
    );
}

// Helper methods para los diferentes tipos de alertas
export const alerts = {
    success: (title: string, description?: string, options?: Partial<Omit<AlertOptions, 'type' | 'title' | 'description'>>) =>
        showAlert({ type: 'success', title, description, ...options }),

    error: (title: string, description?: string, options?: Partial<Omit<AlertOptions, 'type' | 'title' | 'description'>>) =>
        showAlert({ type: 'error', title, description, ...options }),

    warning: (title: string, description?: string, options?: Partial<Omit<AlertOptions, 'type' | 'title' | 'description'>>) =>
        showAlert({ type: 'warning', title, description, ...options }),

    info: (title: string, description?: string, options?: Partial<Omit<AlertOptions, 'type' | 'title' | 'description'>>) =>
        showAlert({ type: 'info', title, description, ...options }),

    // Implementación de confirm mejorada al estilo SweetAlert 2
    confirm: (title: string, message: string, confirmButtonText: string = 'Aceptar', onConfirm: () => void) => {
        // Capa de superposición oscura (overlay)
        const overlayId = `overlay-${Date.now()}`;

        // Primero creamos un overlay que cubre toda la pantalla
        const overlayElement = document.createElement('div');
        overlayElement.id = overlayId;
        overlayElement.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        document.body.appendChild(overlayElement);

        toast.custom(
            (id: string | number) => {
                // Adaptamos el parámetro para que sea compatible
                const t: ToastData = {
                    id,
                    dismiss: () => {
                        toast.dismiss(id);
                        // Eliminar el overlay cuando se cierra
                        const overlay = document.getElementById(overlayId);
                        if (overlay) overlay.remove();
                    },
                };

                return React.createElement(
                    'div',
                    {
                        className: 'w-full max-w-md rounded-lg border bg-white dark:bg-gray-900 shadow-xl animate-in zoom-in-95 duration-200',
                    },
                    [
                        // Icono centrado para las confirmaciones con animación de pulso
                        React.createElement(
                            'div',
                            {
                                className: 'flex justify-center pt-6',
                                key: 'confirmIcon',
                            },
                            React.createElement(AlertTriangle, {
                                className: 'text-amber-500 h-16 w-16 animate-pulse',
                                strokeWidth: 1.5,
                            }),
                        ),

                        React.createElement('div', { className: 'p-6 text-center' }, [
                            React.createElement(
                                'h3',
                                {
                                    className: 'text-xl font-semibold mb-2 text-gray-900 dark:text-white',
                                    key: 'title',
                                },
                                title,
                            ),
                            React.createElement(
                                'p',
                                {
                                    className: 'text-gray-600 dark:text-gray-300 mb-6',
                                    key: 'message',
                                },
                                message,
                            ),

                            React.createElement(
                                'div',
                                {
                                    className: 'flex gap-4 justify-center',
                                    key: 'buttons',
                                },
                                [
                                    React.createElement(
                                        'button',
                                        {
                                            onClick: t.dismiss,
                                            className:
                                                'px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600',
                                        },
                                        'Cancelar',
                                    ),

                                    React.createElement(
                                        'button',
                                        {
                                            onClick: () => {
                                                onConfirm();
                                                t.dismiss();
                                            },
                                            className:
                                                'px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 animate-in fade-in duration-300',
                                        },
                                        confirmButtonText,
                                    ),
                                ],
                            ),
                        ]),
                    ],
                );
            },
            {
                duration: Infinity,
                position: 'top-center' as ToastT['position'],
                id: `confirm-${Date.now()}`,
            },
        );
    },
};
