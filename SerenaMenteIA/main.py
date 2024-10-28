import jwt
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from schemas import PacienteCreate, PacienteResponse, PacienteLogin, PacienteLoginResponse
from crud import crear_paciente, verificar_credenciales
from passlib.context import CryptContext

# Configuración JWT
SECRET_KEY = "h#jnas34_"
ALGORITHM = "HS256"

# Crear las tablas en la base de datos si no existen
models.Base.metadata.create_all(bind=engine)

# Crear la instancia de FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint para registrar un paciente
@app.post("/pacientes/", response_model=PacienteResponse)
def registrar_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    try:
        return crear_paciente(db, paciente)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login/", response_model=PacienteLoginResponse)
def login_paciente(credentials: PacienteLogin, db: Session = Depends(get_db)):
    paciente = verificar_credenciales(db, credentials.Correo, credentials.Contraseña)
    if not paciente:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    # Crear un token JWT con expiración
    expiration = datetime.utcnow() + timedelta(hours=1)  # Expira en 1 hora
    token = jwt.encode({"sub": paciente.ID_Paciente, "exp": expiration}, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "ID_Paciente": paciente.ID_Paciente,
        "Nombre": paciente.Nombre,
        "Correo": paciente.Correo,
        "token": token,  # Verifica que este campo esté presente
        "Mensaje": "Inicio de sesión exitoso"
    }