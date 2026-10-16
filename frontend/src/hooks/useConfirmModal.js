import { useState, useCallback } from "react";

/**
 * Hook para manejar un ConfirmModal.
 * 
 * Devuelve:
 *  - modalProps: objeto de props para pasarle directo a <ConfirmModal>
 *  - requestConfirm(fn): abre el modal; al confirmar ejecuta fn()
 */
export const useConfirmModal = ({ title, message, confirmLabel } = {}) => {
    const [state, setState] = useState({
        isOpen: false,
        onConfirm: null,
        title: title || "¿Estás seguro?",
        message: message || "",
        confirmLabel: confirmLabel || "Confirmar",
    });

    const requestConfirm = useCallback((fn, overrides = {}) => {
        setState((prev) => ({
            ...prev,
            isOpen: true,
            onConfirm: fn,
            ...overrides,
        }));
    }, []);

    const handleCancel = useCallback(() => {
        setState((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
    }, []);

    const handleConfirm = useCallback(() => {
        const fn = state.onConfirm;
        setState((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
        fn?.();
    }, [state.onConfirm]);

    return {
        modalProps: {
            isOpen: state.isOpen,
            title: state.title,
            message: state.message,
            confirmLabel: state.confirmLabel,
            onCancel: handleCancel,
            onConfirm: handleConfirm,
        },
        requestConfirm,
    };
};
