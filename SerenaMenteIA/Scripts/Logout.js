document.getElementById("logoutButton").addEventListener("click", async function() {
    try {
        const response = await fetch("http://127.0.0.1:8000/logout/", {
            method: "POST",
            credentials: "include"  // Para enviar la cookie con la solicitud
        });

        if (response.ok) {
            alert("Has cerrado sesión correctamente.");
            window.location.href = "Inicio_sesion.html";
        } else {
            console.error("Error al cerrar sesión");
        }
    } catch (error) {
        console.error("Error en la solicitud de cierre de sesión:", error);
    }
});