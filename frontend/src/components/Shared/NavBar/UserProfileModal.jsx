import { useState } from "react";
import axios from "axios";
import "./UserProfileModal.css";

const API_URL = "http://localhost:3000/api/user";

const UserProfileModal = ({ currentUser, onClose, onUserUpdated }) => {
  const [name, setName] = useState(currentUser?.name || "");
  const [surname, setSurname] = useState(currentUser?.surname || "");
  const [age, setAge] = useState(currentUser?.age || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (password && password !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload = { name, surname, age, email };
      if (password.trim() !== "") {
        payload.password = password;
      }

      const res = await axios.put(`${API_URL}/${currentUser.id}`, payload);

      setMessage({ text: "¡Perfil actualizado con éxito!", type: "success" });

      if (res.data && res.data.user) {
        onUserUpdated(res.data.user);
      } else {
        onUserUpdated({ ...currentUser, name, surname, age, email });
      }

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setMessage({
        text: err.response?.data?.mensaje || err.response?.data?.error || "Error al actualizar el perfil",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h3>👤 Mi Perfil</h3>
          <button className="profile-close-btn" onClick={onClose}>&times;</button>
        </div>

        {message.text && (
          <div className={`profile-alert profile-alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-form-group">
            <label htmlFor="profile-name">Nombre</label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Tu nombre"
            />
          </div>

          <div className="profile-form-group">
            <label htmlFor="profile-surname">Apellido</label>
            <input
              id="profile-surname"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              placeholder="Tu apellido"
            />
          </div>

          <div className="profile-form-group">
            <label htmlFor="profile-age">Edad</label>
            <input
              id="profile-age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              placeholder="Tu edad"
            />
          </div>

          <div className="profile-form-group">
            <label htmlFor="profile-password">Nueva Contraseña (Opcional)</label>
            <input
              id="profile-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Déjalo en blanco si no querés cambiarla"
            />
          </div>

          {password && (
            <div className="profile-form-group">
              <label htmlFor="profile-confirm-password">Confirmar Nueva Contraseña</label>
              <input
                id="profile-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí tu nueva contraseña"
                required
              />
            </div>
          )}

          <div className="profile-modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;
