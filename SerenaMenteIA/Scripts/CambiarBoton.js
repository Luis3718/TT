document.addEventListener("DOMContentLoaded", async function() {
    const authLink = document.getElementById("authLink");

    try {
        // Hacer una solicitud al backend para verificar si el usuario está autenticado
        const response = await fetch("http://127.0.0.1:8000/usuario-info/", {
            method: "GET",
            credentials: "include"  // Para enviar la cookie con la solicitud
        });

        if (response.ok) {
            // Si está autenticado, mostrar "Cerrar Sesión" en lugar de "Iniciar Sesión"
            const data = await response.json();
            authLink.innerHTML = `<a href="#" id="logoutButton">${data.Nombre} Cerrar Sesión </a>`;

            // Agregar el evento de "Cerrar Sesión" al enlace
            document.getElementById("logoutButton").addEventListener("click", async function(event) {
                event.preventDefault();
                await fetch("http://127.0.0.1:8000/logout/", {
                    method: "POST",
                    credentials: "include"
                });
                alert("Has cerrado sesión correctamente.");
                window.location.href = "Inicio_sesion.html";
            });
        } else {
            // Si no está autenticado, se mantendrá "Iniciar Sesión"
            authLink.innerHTML = `<a href="Inicio_sesion.html">Iniciar sesión</a>`;
        }
    } catch (error) {
        console.error("Error al verificar la sesión del usuario:", error);
        authLink.innerHTML = `<a href="Inicio_sesion.html">Iniciar sesión</a>`;
    }
});