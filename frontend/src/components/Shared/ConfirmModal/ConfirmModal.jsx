import { useEffect } from "react";
import "./ConfirmModal.css";

/**
 * Modal de confirmación reutilizable.
 *
 * Props:
 *  - isOpen     {boolean}   Si el modal debe mostrarse
 *  - title      {string}    Título del modal (opcional)
 *  - message    {string}    Mensaje de confirmación
 *  - confirmLabel {string}  Texto del botón de confirmar (default: "Confirmar")
 *  - cancelLabel  {string}  Texto del botón de cancelar  (default: "Cancelar")
 *  - onConfirm  {function}  Callback al confirmar
 *  - onCancel   {function}  Callback al cancelar
 *  - variant    {string}    "danger" | "warning" (default: "danger")
 */
const ConfirmModal = ({
    isOpen,
    title = "¿Estás seguro?",
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm,
    onCancel,
    variant = "danger",
}) => {
    // Cerrar con Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => { if (e.key === "Escape") onCancel?.(); };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="confirm-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            onClick={onCancel}
        >
            <div
                className={`confirm-modal confirm-modal--${variant}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`confirm-modal-icon confirm-modal-icon--${variant}`}>
                    {variant === "danger" ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                        </svg>
                    )}
                </div>

                <h2 id="confirm-modal-title" className="confirm-modal-title">
                    {title}
                </h2>

                {message && (
                    <p className="confirm-modal-message">{message}</p>
                )}

                <div className="confirm-modal-actions">
                    <button
                        className="confirm-modal-btn confirm-modal-btn--cancel"
                        onClick={onCancel}
                        autoFocus
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`confirm-modal-btn confirm-modal-btn--confirm confirm-modal-btn--${variant}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
