import { useState, useEffect } from "react";
import userService from "../services/userService";
import { getErrorMessage } from "../services/api";
import { useDebounce } from "./useDebounce";
import { useConfirmModal } from "./useConfirmModal";

export const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Disparador para forzar recargas tras activar o desactivar
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const debouncedSearchQuery = useDebounce(searchQuery, 400);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const list = await userService.list(debouncedSearchQuery);
                // Los admins no aparecen en la lista de gestión
                setUsers(list.filter(u => !u.isAdmin));
            } catch (err) {
                console.error("Error al cargar usuarios:", err);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [debouncedSearchQuery, refreshTrigger]);

    const { modalProps: confirmModalProps, requestConfirm } = useConfirmModal();

    const handleToggleActive = async (userId, userName, currentStatus) => {
        const action = currentStatus ? "desactivar" : "activar";
        const title = currentStatus ? "Desactivar usuario" : "Activar usuario";
        const message = currentStatus
            ? `¿Estás seguro de que querés desactivar a "${userName}"? El usuario no podrá iniciar sesión.`
            : `¿Estás seguro de que querés activar a "${userName}"?`;

        requestConfirm(
            async () => {
                try {
                    await userService.toggleActive(userId);
                    setRefreshTrigger(prev => prev + 1);
                } catch (err) {
                    console.error(`Error al ${action} usuario:`, err);
                    alert(getErrorMessage(err, `Error al ${action} el usuario`));
                }
            },
            { title, message, confirmLabel: currentStatus ? "Desactivar" : "Activar" }
        );
    };

    return {
        users,
        loadingUsers,
        searchQuery,
        setSearchQuery,
        handleToggleActive,
        confirmModalProps,
    };
};
