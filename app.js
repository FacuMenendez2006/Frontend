class UserManager {
    constructor() {
        this.API_BASE_URL = "http://localhost:8000";
        this.init();
    }

    init() {
        console.log("🚀 Inicializando aplicación...");
        this.loadUsers();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById("userForm");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.createUser();
        });
    }

    async createUser() {
        const formData = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value || ""  // ✅ Teléfono opcional
        };

        const button = document.getElementById("submitBtn");
        const originalText = button.textContent;
        
        try {
            button.textContent = "⏳ Registrando...";
            button.disabled = true;

            console.log("📤 Enviando datos:", formData);

            const response = await fetch(`${this.API_BASE_URL}/api/usuarios/crear/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log("📥 Respuesta recibida:", result);

            if (response.ok) {
                this.showMessage(
                    `✅ ${result.mensaje} - Notificación por email enviada`, 
                    "success"
                );
                this.resetForm();
                this.loadUsers();
            } else {
                this.showMessage(`❌ Error: ${result.error}`, "error");
            }
        } catch (error) {
            console.error("🔌 Error de conexión:", error);
            this.showMessage(
                "🔌 Error de conexión con el servidor.", 
                "error"
            );
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    }

    async loadUsers() {
        try {
            console.log("📥 Cargando lista de usuarios...");
            const response = await fetch(`${this.API_BASE_URL}/api/usuarios/listar/`);
            
            if (response.ok) {
                const data = await response.json();
                console.log("👥 Usuarios cargados:", data.usuarios);
                this.displayUsers(data.usuarios);
            } else {
                this.showMessage("Error cargando la lista de usuarios", "error");
            }
        } catch (error) {
            console.error("Error cargando usuarios:", error);
            document.getElementById("usersList").innerHTML = 
                '<div class="error">Error conectando con el servidor</div>';
        }
    }

    displayUsers(users) {
        const container = document.getElementById("usersList");
        
        if (!users || users.length === 0) {
            container.innerHTML = '<div class="loading">No hay usuarios registrados todavía</div>';
            return;
        }

        const table = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Fecha de Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.nombre}</td>
                            <td>${user.email}</td>
                            <td>${user.telefono || "No especificado"}</td>
                            <td>${new Date(user.fecha_creacion).toLocaleDateString("es-UY")}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
            <p style="margin-top: 10px; color: #666;">Total: ${users.length} usuario(s)</p>
        `;
        
        container.innerHTML = table;
    }

    resetForm() {
        document.getElementById("userForm").reset();
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById("message");
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = "block";

        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 5000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new UserManager();
});
