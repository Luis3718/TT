import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0kLe5l_gNuBwhkOOvBr8RO150dHCU31k",
  authDomain: "serena-mente.firebaseapp.com",
  projectId: "serena-mente",
  storageBucket: "serena-mente.appspot.com",
  messagingSenderId: "183868385167",
  appId: "1:183868385167:web:442b02f182fc8a28260dfa",
  measurementId: "G-LVWYEJBRHE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function obtenerUsuariosInfo() {
  onAuthStateChanged(auth, async (user) => {
    const userInfoElement = document.getElementById("userInfo");
    const allUsersInfoElement = document.getElementById("allUsersInfo");
    const evaluacionPreviaInfoElement = document.getElementById("evaluacionPreviaInfo");
    const puntuacionesEvaluacionPreviaElement = document.getElementById("puntuacionesEvaluacionPrevia");
    userInfoElement.innerHTML = "";
    allUsersInfoElement.innerHTML = "";
    evaluacionPreviaInfoElement.innerHTML = "";
    puntuacionesEvaluacionPreviaElement.innerHTML = "";

    if (user) {
      const userId = user.uid;
      const userDocRef = doc(db, "psicologos", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists) {
        const userData = userDoc.data();
        const userInfoDiv = document.createElement("div");
        userInfoDiv.classList.add("usuario-info");
        userInfoDiv.classList.add("usuario-autenticado");

        const fields = [
          { label: "ID del usuario", value: userId },
          { label: "Nombre", value: userData.nombre },
          { label: "Apellidos", value: userData.apellido },
          { label: "Correo electrónico", value: userData.email },
        ];

        fields.forEach((field) => {
          const rowDiv = document.createElement("div");
          rowDiv.classList.add("usuario-row");
          rowDiv.innerHTML = `
                <div class="campo">${field.label}:</div>
                <div class="valor">${field.value}</div>
            `;
          userInfoDiv.appendChild(rowDiv);
        });

        userInfoElement.appendChild(userInfoDiv);
        const hrElement = document.createElement("hr");
        hrElement.classList.add("usuario-separator");
        userInfoElement.appendChild(hrElement);
      } else {
        userInfoElement.appendChild(createParagraph("El documento del usuario autenticado no existe"));
      }
    } else {
      userInfoElement.appendChild(createParagraph("No hay usuario autenticado"));
    }

    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);
    const totalUsuariosRegistrados = usersSnapshot.size;
    const totalUsuariosRegistradosElement = document.getElementById("totalUsuariosRegistrados");
    totalUsuariosRegistradosElement.innerHTML = `<strong style="color: #2DAAA7; font-size: 18px;">Total de registrados: </strong>${totalUsuariosRegistrados}`;
    totalUsuariosRegistradosElement.insertAdjacentHTML("afterend", "<hr>");

    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const userId = doc.id;
      const userDiv = document.createElement("div");
      userDiv.classList.add("usuario-info");

      const fields = [
        { label: "ID del usuario", value: userId },
        { label: "Nombre", value: userData.nombre },
        { label: "Apellidos", value: userData.apellido },
        { label: "Correo electrónico", value: userData.email },
        { label: "Número Telefónico", value: userData.numeroTelefonico },
        { label: "Edad", value: userData.edad },
        { label: "Estado civil", value: userData.estadoCivil },
        { label: "Género", value: userData.genero },
        { label: "Ocupación", value: userData.ocupacion },
        { label: "Nivel de estudios", value: userData.nivelEstudios },
      ];

      fields.forEach((field) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("usuario-row");
        rowDiv.innerHTML = `
            <div class="campo">${field.label}:</div>
            <div class="valor">${field.value}</div>
        `;
        userDiv.appendChild(rowDiv);
      });
      allUsersInfoElement.appendChild(userDiv);
      const hrElement = document.createElement("hr");
      hrElement.classList.add("usuario-separator");
      allUsersInfoElement.appendChild(hrElement);
    }

    const evaluacionRealizadaCollectionRef = collection(db, "evaluacionRealizada");
    const evaluacionRealizadaSnapshot = await getDocs(evaluacionRealizadaCollectionRef);

    evaluacionPreviaInfoElement.appendChild(document.createElement("br"));
    let totalRealizada = 0;
    let totalNoRealizada = 0;
    for (const doc of evaluacionRealizadaSnapshot.docs) {
      const userId = doc.id;
      const evaluacionRealizadaData = doc.data();
      const evaluacionPreviaRealizada = evaluacionRealizadaData.evaluacionPreviaRealizada ? "Realizada" : "No realizada";

      const evaluacionPreviaRowDiv = document.createElement("div");
      evaluacionPreviaRowDiv.classList.add("usuario-row");

      const idUsuarioDiv = document.createElement("div");
      idUsuarioDiv.classList.add("campo");
      idUsuarioDiv.textContent = "ID del usuario:";
      evaluacionPreviaRowDiv.appendChild(idUsuarioDiv);

      const valorIdUsuarioDiv = document.createElement("div");
      valorIdUsuarioDiv.classList.add("valor");
      valorIdUsuarioDiv.textContent = userId;
      evaluacionPreviaRowDiv.appendChild(valorIdUsuarioDiv);

      const evaluacionPreviaDiv = document.createElement("div");
      evaluacionPreviaDiv.classList.add("campo");
      evaluacionPreviaDiv.textContent = "Evaluación Previa:";
      evaluacionPreviaRowDiv.appendChild(evaluacionPreviaDiv);

      const valorEvaluacionPreviaDiv = document.createElement("div");
      valorEvaluacionPreviaDiv.classList.add("valor");
      valorEvaluacionPreviaDiv.textContent = evaluacionPreviaRealizada;
      evaluacionPreviaRowDiv.appendChild(valorEvaluacionPreviaDiv);

      evaluacionPreviaInfoElement.appendChild(evaluacionPreviaRowDiv);

      // Incrementar el contador según si la evaluación previa está realizada o no
      if (evaluacionPreviaRealizada === "Realizada") {
        totalRealizada++;
      } else {
        totalNoRealizada++;
      }
    }

    // Mostrar el total de usuarios que han realizado y no han realizado la evaluación previa
    evaluacionPreviaInfoElement.insertAdjacentHTML(
      "beforeend",
      `<hr class="usuario-separator"><strong style="color: #2DAAA7; font-size: 16px;">Total Realizadas: </strong>${totalRealizada}`
    );
    evaluacionPreviaInfoElement.insertAdjacentHTML(
      "beforeend",
      `<hr class="usuario-separator"><strong style="color: #2DAAA7; font-size: 16px;">Total No Realizadas: </strong>${totalNoRealizada}`
    );
    evaluacionPreviaInfoElement.insertAdjacentHTML("beforeend", "<hr>");

    const evaluacionPreviaCollectionRef = collection(db, "resultadosEvaluacionPrevia");
    const evaluacionPreviaSnapshot = await getDocs(evaluacionPreviaCollectionRef);
    puntuacionesEvaluacionPreviaElement.appendChild(document.createElement("br"));

    for (const doc of evaluacionPreviaSnapshot.docs) {
      const userId = doc.id;
      const evaluacionPreviaData = doc.data();
      const userDiv = document.createElement("div");
      userDiv.classList.add("usuario-info", "usuario-evaluacion-previa");

      const fields = [
        { label: "ID del usuario", value: userId },
        { label: "Puntuación Total BAI", value: evaluacionPreviaData.puntuacionTotalBAI,},
        { label: "Puntuación Total BDI", value: evaluacionPreviaData.puntuacionTotalBDI,},
        { label: "Puntuación Total PSS", value: evaluacionPreviaData.puntuacionTotalPSS,},
        { label: "Puntuación Total MINI",
          value: `${evaluacionPreviaData.puntuacionTotalMINI.count} - ${evaluacionPreviaData.puntuacionTotalMINI.nivel}`,
        },
        { label: "Puntuación Total WBI", value: evaluacionPreviaData.puntuacionTotalWBI,},
        { label: "Puntuación Total ICSP", value: evaluacionPreviaData.puntuacionTotalICSP,},
      ];

      fields.forEach((field) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("usuario-row");
        rowDiv.innerHTML = `
              <div class="campo">${field.label}:</div>
              <div class="valor">${field.value}</div>
            `;
        userDiv.appendChild(rowDiv);
      });

      puntuacionesEvaluacionPreviaElement.appendChild(userDiv);

      const hrElement = document.createElement("hr");
      hrElement.classList.add("usuario-separator");
      //puntuacionesEvaluacionPreviaElement.appendChild(hrElement);
      
      let cuestionariosList = document.createElement("ul");
      puntuacionesEvaluacionPreviaElement.appendChild(cuestionariosList);
      puntuacionesEvaluacionPreviaElement.appendChild(document.createElement("hr"));
    }  //aqui termina el for

    const allUsersInfoAplicacionElement = document.getElementById("allUsersInfoAplicacion");
    allUsersInfoAplicacionElement.innerHTML = ""; // Limpiar el contenido previo

    const usersCollectionRefApp = collection(db, "usuarios");
    const usersSnapshotApp = await getDocs(usersCollectionRefApp);
    const totalUsuariosRegistradosAplicacion = usersSnapshotApp.size;
    const totalUsuariosRegistradosAplicacionElement = document.getElementById("totalUsuariosRegistradosAplicacion");
    totalUsuariosRegistradosAplicacionElement.innerHTML = `<strong style="color: #2DAAA7; font-size: 18px;">Total de registrados: </strong>${totalUsuariosRegistradosAplicacion}`;
    totalUsuariosRegistradosAplicacionElement.insertAdjacentHTML("afterend", "<hr>");

    for (const doc of usersSnapshotApp.docs) {
      const userData = doc.data();
      const userId = doc.id;
      const userDiv = document.createElement("div");
      userDiv.classList.add("usuario-info");

      const fields = [
        { label: "ID del usuario", value: userId },
        { label: "Nombre", value: userData.nombre },
        { label: "Apellidos", value: userData.apellido },
        { label: "Correo electrónico", value: userData.email },
        { label: "Número Telefónico", value: userData.number },
        { label: "Edad", value: userData.edad },
        { label: "Estado civil", value: userData.estadoCivil },
        { label: "Género", value: userData.genero },
        { label: "Ocupación", value: userData.ocupacion },
        { label: "Nivel de estudios", value: userData.educacion },
      ];

      fields.forEach((field) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("usuario-row");
        rowDiv.innerHTML = `
          <div class="campo">${field.label}:</div>
          <div class="valor">${field.value}</div>
        `;
        userDiv.appendChild(rowDiv);
      });

      allUsersInfoAplicacionElement.appendChild(userDiv);
      allUsersInfoAplicacionElement.appendChild(document.createElement("hr"));
    }

    const evaluacionPreviaAppCollectionRef = collection(db, "pre");
    const evaluacionPreviaAppSnapshot = await getDocs(evaluacionPreviaAppCollectionRef);

    const puntuacionesEvaluacionPreviaAplicacionElement = document.getElementById("puntuacionesEvaluacionPreviaAplicacion");
    const interbloqueInfoAplicacionElement = document.getElementById("interbloqueInfoAplicacion"); // Nuevo div para interbloque
    puntuacionesEvaluacionPreviaAplicacionElement.innerHTML = "";
    interbloqueInfoAplicacionElement.innerHTML = "";
    
    puntuacionesEvaluacionPreviaAplicacionElement.appendChild(document.createElement("br"));
    for (const doc of evaluacionPreviaAppSnapshot.docs) {
      const userId = doc.id;
      const evaluacionPreviaData = doc.data();
      const userDiv = document.createElement("div");
      userDiv.classList.add("usuario-info", "usuario-evaluacion-previa");

      const fields = [
        { label: "ID del usuario", value: userId },
        { label: "Puntuación Total BAI",value: evaluacionPreviaData.puntuacionTotalBAI,    },
        { label: "Puntuación Total BDI", value: evaluacionPreviaData.puntuacionTotalBDI,   },
        { label: "Puntuación Total PSS", value: evaluacionPreviaData.puntuacionTotalPSS,   },
        { label: "Puntuación Total MINI", value: evaluacionPreviaData.puntuacionTotalMINI, },
        { label: "Puntuación Total WBI", value: evaluacionPreviaData.puntuacionTotalWBI,   },
        { label: "Puntuación Total ICSP", value: evaluacionPreviaData.puntuacionTotalICSP, },
      ];

      fields.forEach((field) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("usuario-row");
        rowDiv.innerHTML = `
              <div class="campo">${field.label}:</div>
              <div class="valor">${field.value}</div>
            `;
        userDiv.appendChild(rowDiv);
      });

      puntuacionesEvaluacionPreviaAplicacionElement.appendChild(userDiv);
      const hrElement = document.createElement("hr");
      hrElement.classList.add("usuario-separator");
      /*let cuestionariosList = document.createElement("ul");
      puntuacionesEvaluacionPreviaAplicacionElement.appendChild(cuestionariosList);
      puntuacionesEvaluacionPreviaAplicacionElement.appendChild(document.createElement("hr"));*/
      puntuacionesEvaluacionPreviaAplicacionElement.appendChild(hrElement);
    }

    // Crear contenedor para interbloque en el nuevo div
    const contenedorInterbloque = document.createElement("div");
    interbloqueInfoAplicacionElement.appendChild(contenedorInterbloque);
    
    // Ciclo para obtener los usuarios de cada evaluación interbloque
    for (let i = 1; i <= 6; i++) {
      const interBloqueCollectionRef = collection(db, `interBloque${i}`);
      const interBloqueSnapshot = await getDocs(interBloqueCollectionRef);
    
      if (!interBloqueSnapshot.empty) {
        const interBloqueSection = document.createElement("div");
        interBloqueSection.classList.add(`interbloque-section`);
        
        const interBloqueTitle = document.createElement("h3");
        interBloqueTitle.textContent = `Usuarios que realizaron la evaluación interbloque ${i}`;
        interBloqueTitle.classList.add("titulos");
        interBloqueSection.appendChild(interBloqueTitle);
    
        interBloqueSnapshot.forEach((doc) => {
          const userId = doc.id;
          const docData = doc.data();
          const sentimiento = docData.sentimiento;
    
          const userDiv = document.createElement("div");
          userDiv.classList.add("usuario-info", "usuario-evaluacion-previa");
    
          const idUsuarioRow = document.createElement("div");
          idUsuarioRow.classList.add("usuario-row");
          idUsuarioRow.innerHTML = `
            <div class="campo">ID del usuario:</div>
            <div class="valor">${userId}</div>
          `;
          userDiv.appendChild(idUsuarioRow);
    
          const sentimientoRow = document.createElement("div");
          sentimientoRow.classList.add("usuario-row");
          sentimientoRow.innerHTML = `
            <div class="campo">Sentimiento:</div>
            <div class="valor">${sentimiento}</div>
          `;
          userDiv.appendChild(sentimientoRow);
    
          interBloqueSection.appendChild(userDiv);
          interBloqueSection.appendChild(document.createElement("hr"));
        });
    
        contenedorInterbloque.appendChild(interBloqueSection);
      } else {
        const noUsersMessage = document.createElement("p");
        noUsersMessage.textContent = `No hay usuarios que hayan realizado la evaluación interbloque ${i}`;
        contenedorInterbloque.appendChild(noUsersMessage);
      }
    }
  });
}

function createParagraph(html) {
  const p = document.createElement("p");
  p.innerHTML = html;
  return p;
}

document.addEventListener("DOMContentLoaded", obtenerUsuariosInfo);

document.addEventListener("DOMContentLoaded", function () {
  const exportWebUsersButton = document.getElementById("exportUsersPaginaCSVButton");
  exportWebUsersButton.addEventListener("click", exportWebUsersCSV);

  const exportAppUsersButton = document.getElementById("exportUsersAplicacionCSVButton");
  exportAppUsersButton.addEventListener("click", exportAppUsersCSV);

  const exportAppUsersEvPrevButton = document.getElementById("exportUsersEvPrevRealizadaCSVButton");
  exportAppUsersEvPrevButton.addEventListener("click", exportAppUsersEvPrevCSV);

  const exportAllDataUsersEvPrevButton = document.getElementById("exportAllDataUsersCSVButton");
  exportAllDataUsersEvPrevButton.addEventListener("click", exportAllDataAsCSV);

  const exportEvaluacionPreviaButton = document.getElementById("exportEvaluacionPreviaPaginaCSVButton");
  exportEvaluacionPreviaButton.addEventListener("click", exportEvaluacionPreviaPaginaCSV);

  const exportEvaluacionPreviaAplicacionButton = document.getElementById("exportEvaluacionPreviaAplicacionCSVButton");
  exportEvaluacionPreviaAplicacionButton.addEventListener("click", exportEvaluacionPreviaAplicacionCSV);

  const exportEvaluacionesInterbloqueButton = document.getElementById("exportEvaluacionesInterbloqueButton");
  exportEvaluacionesInterbloqueButton.addEventListener("click", exportEvaluacionesInterbloqueCSV);

  function exportAllDataAsCSV() {
    exportWebUsersCSV();
    exportAppUsersCSV();
    exportAppUsersEvPrevCSV();
    exportEvaluacionPreviaPaginaCSV();
    exportEvaluacionPreviaAplicacionCSV();
    exportEvaluacionesInterbloqueCSV();
  }

  function exportWebUsersCSV() {
    const webUsersContainer = document.getElementById("allUsersInfo");
    const csvContent = generateCSV(webUsersContainer);
    downloadCSV(csvContent, "UsuariosPagina.csv");
  }

  function exportAppUsersCSV() {
    const appUsersContainer = document.getElementById("allUsersInfoAplicacion");
    const csvContent = generateCSV(appUsersContainer);
    downloadCSV(csvContent, "UsuariosAplicacion.csv");
  }

  function exportAppUsersEvPrevCSV() {
    const appUsersContainer = document.getElementById("evaluacionPreviaInfo");
    const csvContent = generateCSVWithEvalInfo(appUsersContainer);
    downloadCSV(csvContent, "UsuariosEvaluacionPreviaRealizada.csv");
  }

  function exportEvaluacionPreviaPaginaCSV() {
    const evaluacionPreviaContainer = document.getElementById("puntuacionesEvaluacionPrevia");
    const csvContent = generateEvaluacionPreviaPaginaCSV(evaluacionPreviaContainer);
    downloadCSV(csvContent, "PuntuacionesEvaluacionesPreviasPagina.csv");
  }

  function exportEvaluacionPreviaAplicacionCSV() {
    const evaluacionPreviaAplicacionContainer = document.getElementById("puntuacionesEvaluacionPreviaAplicacion");
    const csvContent = generateEvaluacionPreviaAplicacionCSV(evaluacionPreviaAplicacionContainer);
    downloadCSV(csvContent, "PuntuacionesEvaluacionesPreviasAplicacion.csv");
  }

  function exportEvaluacionesInterbloqueCSV() {
    const interbloqueContainer = document.getElementById("interbloqueInfoAplicacion");
    const csvContent = generateInterbloqueCSV(interbloqueContainer);
    downloadCSV(csvContent, "EvaluacionesInterbloque.csv");
  }

  function generateCSV(container) {
    const rows = container.querySelectorAll(".usuario-info");
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";

    const firstUserFields = rows[0].querySelectorAll(".campo");
    const fieldNames = Array.from(firstUserFields).map((field) => field.textContent.trim());
    const fieldRowCSV = fieldNames
      .map((field) => `"${field.replace(/"/g, '""')}"`)
      .join(",");
    csvContent += fieldRowCSV + "\r\n";

    rows.forEach((row) => {
      const fields = row.querySelectorAll(".valor");
      const rowData = Array.from(fields).map((field) => field.textContent.trim());
      const rowCSV = rowData
        .map((field) => `"${field.replace(/"/g, '""')}"`)
        .join(","); 
      csvContent += rowCSV + "\r\n";
    });
    return csvContent;
  }

  function generateCSVWithEvalInfo(container) {
    const rows = container.querySelectorAll(".usuario-row");
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
    csvContent += '"ID del usuario","Evaluación Previa Realizada - No Realizada"\r\n';

    rows.forEach((row) => {
      const idUsuario = row.querySelector(".valor").textContent.trim();
      const evaluacionPrevia = row
        .querySelector(".valor:last-of-type")
        .textContent.trim();
      const rowData = `"${idUsuario.replace(
        /"/g,
        '""'
      )}","${evaluacionPrevia.replace(/"/g, '""')}"`;
      csvContent += rowData + "\r\n";
    });
    return csvContent;
  }

  function generateEvaluacionPreviaPaginaCSV(container) {
    const usuariosEvaluacionPrevia = container.querySelectorAll(".usuario-evaluacion-previa");
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 

    const firstUserFields = usuariosEvaluacionPrevia[0].querySelectorAll(".campo");
    const fieldNames = Array.from(firstUserFields).map((field) => field.textContent.trim());
    const fieldRowCSV = fieldNames
      .map((field) => `"${field.replace(/"/g, '""')}"`)
      .join(",");

    csvContent += fieldRowCSV + "\r\n";

    usuariosEvaluacionPrevia.forEach((usuario) => {
      const fields = usuario.querySelectorAll(".valor");
      const rowData = Array.from(fields).map((field) => field.textContent.trim());
      const rowCSV = rowData
        .map((field) => `"${field.replace(/"/g, '""')}"`)
        .join(",");
      csvContent += rowCSV + "\r\n";
    });
    return csvContent;
  }

  function generateEvaluacionPreviaAplicacionCSV(container) {
    const usuariosEvaluacionPrevia = container.querySelectorAll(".usuario-evaluacion-previa");
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    const firstUserFields = usuariosEvaluacionPrevia[0].querySelectorAll(".campo");
    const fieldNames = Array.from(firstUserFields).map((field) => field.textContent.trim());
    const fieldRowCSV = fieldNames
      .map((field) => `"${field.replace(/"/g, '""')}"`)
      .join(",");
    csvContent += fieldRowCSV + "\r\n";

    usuariosEvaluacionPrevia.forEach((usuario) => {
      const fields = usuario.querySelectorAll(".valor");
      const rowData = Array.from(fields).map((field) => field.textContent.trim());
      const rowCSV = rowData
        .map((field) => `"${field.replace(/"/g, '""')}"`)
        .join(",");
      csvContent += rowCSV + "\r\n";
    });
    return csvContent;
  }
  
  function generateInterbloqueCSV(container) {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    const interbloqueSections = container.querySelectorAll(".interbloque-section");

    interbloqueSections.forEach((section) => {
      const evaluacionTitulo = section.querySelector("h3").textContent.trim();
      csvContent += `"${evaluacionTitulo}"\r\n`;
      csvContent += "\"ID del usuario\",\"Sentimiento\"\r\n";

      const usuariosEvaluacion = section.querySelectorAll(".usuario-evaluacion-previa");
      usuariosEvaluacion.forEach((usuario) => {
        const idUsuarioRow = usuario.querySelector(".usuario-row:first-child .valor");
        const idUsuario = idUsuarioRow ? idUsuarioRow.textContent.trim() : "";
        const sentimientoRow = usuario.querySelector(".usuario-row:last-child .valor");
        const sentimiento = sentimientoRow ? sentimientoRow.textContent.trim() : "";
        const rowData = `"${idUsuario.replace(/"/g, '""')}","${sentimiento.replace(/"/g, '""')}"\r\n`;
        csvContent += rowData;
      });
      csvContent += "\r\n";
    });
    return csvContent;
  }

  function downloadCSV(csvContent, filename) {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  }
});