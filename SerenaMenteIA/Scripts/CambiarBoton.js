document.addEventListener("DOMContentLoaded", async function() {
    const authLink = document.getElementById("authLink");
    const avatarSection = document.querySelector(".avatar-section");
    const avatar = document.getElementById("avatar");
    const submenu = document.getElementById("submenu");
    const username = document.getElementById("username");
    const logoutBtn = document.getElementById("logoutBtn");

    try {
        // Hacer una solicitud al backend para verificar si el usuario está autenticado
        const response = await fetch("http://127.0.0.1:8000/usuario-info/", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();
            username.textContent = data.Nombre;

            // Mostrar el submenú al hacer clic en el avatar
            avatar.addEventListener("click", function() {
                submenu.style.display = submenu.style.display === "none" ? "block" : "none";
            });

            // Cerrar sesión al hacer clic en el botón de cerrar sesión
            logoutBtn.addEventListener("click", async function() {
                await fetch("http://127.0.0.1:8000/logout/", {
                    method: "POST",
                    credentials: "include"
                });
                alert("Has cerrado sesión correctamente.");
                window.location.href = "Inicio_sesion.html";
            });

            // Ocultar el submenú si el usuario hace clic fuera de él
            document.addEventListener("click", function(event) {
                if (!avatar.contains(event.target) && !submenu.contains(event.target)) {
                    submenu.style.display = "none";
                }
            });
        } else {
            // Si no está autenticado, ocultar la sección de avatar y mostrar "Iniciar Sesión"
            if (avatarSection) {
                avatarSection.style.display = "none";
            }
        }
    } catch (error) {
        console.error("Error al verificar la sesión del usuario:", error);
        authLink.innerHTML = `<a href="Inicio_sesion.html">Iniciar sesión</a>`;
        if (avatarSection) {
            avatarSection.style.display = "none";
        }
    }
});
