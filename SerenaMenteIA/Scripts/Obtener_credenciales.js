document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Hacer la solicitud al backend para obtener el nombre del usuario
        const response = await fetch("http://127.0.0.1:8000/usuario-info/", {
            method: "GET",
            credentials: "include"  // Esto envía la cookie con la solicitud
        });

        if (response.ok) {
            const data = await response.json();
            // Mostrar el nombre del usuario en el elemento con id "nombrePaciente"
            document.getElementById("nombrePaciente").textContent = `¡Bienvenido, ${data.Nombre}!`;
        } else {
            console.error("No se pudo obtener la información del usuario");
        }
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
    }
});