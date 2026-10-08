import AdminUserPanel from "../../components/Shared/NavBar/AdminUserPanel";
import "./AdminUsers.css";

// Página exclusiva del nivel de acceso "admin" (la ruta se protege en App.jsx)
const AdminUsers = () => (
  <div className="admin-page">
    <AdminUserPanel />
  </div>
);

export default AdminUsers;
