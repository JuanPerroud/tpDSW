import { useAdminUsers } from "../../../hooks/userAdminUsers";
import SearchBar from "../../Shared/SearchBar";

const AdminUserPanel = () => {
    const {
        users,
        loadingUsers,
        setSearchQuery,
        handleToggleActive,
        handleDeleteUser
    } = useAdminUsers();

    return (
        <div className="admin-panel">
            <div className="admin-panel-header">
                <h3>Gestión de Usuarios</h3>
                <span className="admin-badge">Admin</span>
            </div>

            <div className="admin-search-container">
                <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="🔍 Buscar por nombre o email..."
                    className="admin-search-input"
                />
            </div>

            {loadingUsers ? (
                <div className="admin-panel-loading">Cargando...</div>
            ) : users.length === 0 ? (
                <div className="admin-panel-empty">No hay usuarios registrados.</div>
            ) : (
                <ul className="admin-user-list">
                    {users.map(user => (
                        <li key={user.id} className={`admin-user-item ${!user.status ? 'user-inactive' : ''}`}>
                            <div className="admin-user-info">
                                <span className="admin-user-name">{user.name}</span>
                                <span className="admin-user-email">{user.email}</span>
                                <span className={`admin-user-status ${user.status ? 'status-active' : 'status-inactive'}`}>
                                    {user.status ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div className="admin-user-actions">
                                <button
                                    className={`admin-action-btn ${user.status ? 'btn-deactivate' : 'btn-activate'}`}
                                    onClick={() => handleToggleActive(user.id)}
                                    title={user.status ? 'Desactivar' : 'Activar'}
                                >
                                    {user.status ? '⏸' : '▶'}
                                </button>
                                <button
                                    className="admin-action-btn btn-delete"
                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                    title="Eliminar"
                                >
                                    🗑
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminUserPanel;