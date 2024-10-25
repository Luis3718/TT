from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from schemas import PacienteCreate, PacienteResponse, PacienteLogin, PacienteLoginResponse
from crud import crear_paciente, verificar_credenciales
from passlib.context import CryptContext


# Crear las tablas en la base de datos si no existen
models.Base.metadata.create_all(bind=engine)

# Crear la instancia de FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir cualquier origen
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Endpoint para registrar un paciente
@app.post("/pacientes/", response_model=PacienteResponse)
def registrar_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    try:
        return crear_paciente(db, paciente)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint para iniciar sesión
@app.post("/login/", response_model=PacienteLoginResponse)
def login_paciente(credentials: PacienteLogin, db: Session = Depends(get_db)):
    paciente = verificar_credenciales(db, credentials.Correo, credentials.Contraseña)
    if not paciente:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    return PacienteLoginResponse(
        ID_Paciente=paciente.ID_Paciente,
        Nombre=paciente.Nombre,
        Correo=paciente.Correo,
        Mensaje="Inicio de sesión exitoso"
    )
