from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from schemas import PacienteCreate, PacienteResponse
from crud import crear_paciente

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

# Puedes agregar más rutas aquí, si es necesario.
