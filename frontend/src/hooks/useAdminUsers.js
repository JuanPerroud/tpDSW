import { useState, useEffect } from "react";
import userService from "../services/userService";
import { getErrorMessage } from "../services/api";
import { useDebounce } from "./useDebounce";

export const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Disparador para forzar recargas tras activar, desactivar o eliminar
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

    const handleToggleActive = async (userId) => {
        try {
            await userService.toggleActive(userId);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            alert(getErrorMessage(err, "Error al cambiar estado del usuario"));
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`¿Estás seguro de eliminar a "${userName}"? Esta acción no se puede deshacer.`)) return;

        try {
            await userService.remove(userId);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
            alert(getErrorMessage(err, "Error al eliminar usuario"));
        }
    };

    return {
        users,
        loadingUsers,
        searchQuery,
        setSearchQuery,
        handleToggleActive,
        handleDeleteUser
    };
};
