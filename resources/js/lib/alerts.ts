import { toast, ToastT } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, InfoIcon } from "lucide-react";
import React from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertOptions {
  type: AlertType;
  title: string;
  description?: string;
  duration?: number;
  position?: ToastT["position"];
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

// Iconos para los diferentes tipos de alertas
const AlertIcons: Record<AlertType, React.ReactNode> = {
  success: React.createElement(CheckCircle2, { className: "text-emerald-500 h-5 w-5" }),
  error: React.createElement(XCircle, { className: "text-destructive h-5 w-5" }),
  warning: React.createElement(AlertTriangle, { className: "text-amber-500 h-5 w-5" }),
  info: React.createElement(InfoIcon, { className: "text-blue-500 h-5 w-5" }),
};

// Estilos para los diferentes tipos de alertas
const alertStyles: Record<AlertType, string> = {
  success: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
  error: "bg-destructive/10 border-destructive/20 dark:bg-destructive/20 dark:border-destructive/30",
  warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
};

/**
 * Muestra una alerta personalizada con Sonner
 */
export function showAlert(options: AlertOptions): void {
  const {
    type = "info",
    title,
    description,
    duration = 5000,
    position = "top-right",
    action,
    onDismiss,
  } = options;

  toast.custom(
    (t) => React.createElement("div", {
      className: `flex w-full max-w-sm gap-3 rounded-lg border p-4 shadow-md ${alertStyles[type]} ${
        t.visible ? "animate-in fade-in" : "animate-out fade-out"
      }`
    }, [
      React.createElement("div", { className: "flex-shrink-0", key: "icon" }, AlertIcons[type]),
      
      React.createElement("div", { className: "flex-1 space-y-1", key: "content" }, [
        React.createElement("p", { className: "font-medium text-foreground", key: "title" }, title),
        description && React.createElement("p", { className: "text-sm text-muted-foreground", key: "desc" }, description),
        
        action && React.createElement("div", { className: "mt-3", key: "action" }, 
          React.createElement("button", {
            onClick: () => {
              action.onClick();
              toast.dismiss(t.id);
            },
            className: "text-sm font-medium underline transition-colors hover:opacity-80"
          }, action.label)
        )
      ]),
      
      React.createElement("button", {
        key: "closeBtn",
        onClick: () => {
          toast.dismiss(t.id);
          onDismiss?.();
        },
        className: "flex-shrink-0 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
      }, React.createElement("svg", {
        className: "h-4 w-4",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, [
        React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18", key: "line1" }),
        React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18", key: "line2" })
      ]))
    ]),
    { duration, position, id: `${type}-${Date.now()}` }
  );
}

// Helper methods para los diferentes tipos de alertas
export const alerts = {
  success: (title: string, description?: string, options?: Partial<Omit<AlertOptions, "type" | "title" | "description">>) => 
    showAlert({ type: "success", title, description, ...options }),
    
  error: (title: string, description?: string, options?: Partial<Omit<AlertOptions, "type" | "title" | "description">>) => 
    showAlert({ type: "error", title, description, ...options }),
    
  warning: (title: string, description?: string, options?: Partial<Omit<AlertOptions, "type" | "title" | "description">>) => 
    showAlert({ type: "warning", title, description, ...options }),
    
  info: (title: string, description?: string, options?: Partial<Omit<AlertOptions, "type" | "title" | "description">>) => 
    showAlert({ type: "info", title, description, ...options }),
};
