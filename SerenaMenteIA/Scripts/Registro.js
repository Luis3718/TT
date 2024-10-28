function validateAge() {
        const edadInput = document.getElementById("edad");
        const edad = parseInt(edadInput.value);

        if (edad < 18) {
            edadInput.setCustomValidity("La edad debe ser 18 o mayor.");
        } else {
            edadInput.setCustomValidity(""); // Resetea el mensaje de error si es válido
        }
        }
        
function toggleMedicacionField() {
    const tomaMedicamentos = document.getElementById("tomaMedicamentos").value;
    const medicacionField = document.getElementById("medicacionField");

    if (tomaMedicamentos === "Sí") {
        medicacionField.style.display = "block";
    } else {
        medicacionField.style.display = "none";
    }
}
document.getElementById("registroForm").addEventListener("submit", async (event) => {
event.preventDefault();

const formData = new FormData(event.target);
const data = {};
    
formData.forEach((value, key) => {
    data[key] = value;
});

try {
    const response = await fetch("http://localhost:8000/pacientes/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert("Paciente registrado con éxito.");
        event.target.reset(); // Limpiar el formulario
    } else {
        const errorData = await response.json();
        alert("Error al registrar el paciente: " + errorData.detail);
    }
} catch (error) {
    alert("Error de conexión: " + error.message);
}
});