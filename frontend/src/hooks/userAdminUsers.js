import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "./useDebounce";

const API_URL = "http://localhost:3000/api/user";
const ADMIN_ID = 1;

export const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // 1. Creamos un "disparador" para forzar recargas
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const debouncedSearchQuery = useDebounce(searchQuery, 400);

    // 2. Toda la lógica de obtención de datos vive DENTRO del useEffect
    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const url = debouncedSearchQuery
                    ? `${API_URL}?search=${encodeURIComponent(debouncedSearchQuery)}`
                    : API_URL;
                const res = await axios.get(url);
                setUsers(res.data.filter(u => u.id !== ADMIN_ID));
            } catch (err) {
                console.error("Error al cargar usuarios:", err);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [debouncedSearchQuery, refreshTrigger]); // 3. Dependencias perfectas y sin advertencias

    const handleToggleActive = async (userId) => {
        try {
            await axios.patch(`${API_URL}/${userId}/toggle-active?adminId=${ADMIN_ID}`);
            // 4. En vez de llamar a la función, actualizamos el estado para disparar el useEffect
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            alert(err.response?.data?.mensaje || "Error al cambiar estado del usuario");
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`¿Estás seguro de eliminar a "${userName}"? Esta acción no se puede deshacer.`)) return;

        try {
            await axios.delete(`${API_URL}/${userId}?adminId=${ADMIN_ID}`);
            // 4. Disparamos la recarga reactivamente
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
            alert(err.response?.data?.mensaje || "Error al eliminar usuario");
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