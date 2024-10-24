from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base
from schemas import PacienteCreate, PacienteLogin
from crud import create_paciente, authenticate_paciente

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes especificar dominios en lugar de "*"
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

# Dependency para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register/")
def register_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    db_paciente = create_paciente(db, paciente)
    return {"message": "Paciente registrado exitosamente", "id": db_paciente.id_paciente}

@app.post("/login/")
def login_paciente(paciente: PacienteLogin, db: Session = Depends(get_db)):
    db_paciente = authenticate_paciente(db, paciente.nombre_usuario, paciente.contraseña)
    if not db_paciente:
        raise HTTPException(status_code=400, detail="Nombre de usuario o contraseña incorrectos")
    return {"message": "Login exitoso", "id": db_paciente.id_paciente}
