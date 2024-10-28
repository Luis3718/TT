 document.getElementById("loginForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            Correo: formData.get("Correo"),
            Contraseña: formData.get("Contraseña")
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                credentials: "include"  // Envía las cookies con la solicitud
            });

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem("Nombre", responseData.Nombre);
                alert("Inicio de sesión exitoso");
                window.location.href = "index.html";
            } else {
                const errorData = await response.json();
                console.log("Detalles del error:", errorData);
                alert("Error: " + errorData.detail);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error al intentar iniciar sesión.");
        }
    });
