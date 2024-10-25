from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Literal, Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware

# Conectar a la base de datos
DATABASE_URL = "mysql+mysqlconnector://root:root@localhost/telepsicologia"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelos de SQLAlchemy
class NivelesEstudios(Base):
    __tablename__ = "NivelesEstudios"
    ID_NivelEstudios = Column(Integer, primary_key=True)
    NivelEstudios = Column(String(100), nullable=False)

class Ocupaciones(Base):
    __tablename__ = "Ocupaciones"
    ID_Ocupacion = Column(Integer, primary_key=True)
    Ocupacion = Column(String(100), nullable=False)

class Residencias(Base):
    __tablename__ = "Residencias"
    ID_Residencia = Column(Integer, primary_key=True)
    Residencia = Column(String(100), nullable=False)

class EstadoCivil(Base):
    __tablename__ = "EstadoCivil"
    ID_EstadoCivil = Column(Integer, primary_key=True)
    Estado = Column(String(50), nullable=False)

# Definir la tabla Pacientes
class Pacientes(Base):
    __tablename__ = "Pacientes"
    ID_Paciente = Column(Integer, primary_key=True, autoincrement=True)
    Nombre = Column(String(255), nullable=False)
    Correo = Column(String(255), unique=True, nullable=False)
    Contraseña = Column(String(255), nullable=False)
    Sexo = Column(Enum('Mujer', 'Hombre', 'Prefiero no decirlo'), nullable=False)
    Edad = Column(Integer, nullable=False)
    ID_NivelEstudios = Column(Integer, ForeignKey("NivelesEstudios.ID_NivelEstudios"))
    ID_Ocupacion = Column(Integer, ForeignKey("Ocupaciones.ID_Ocupacion"))
    ID_Residencia = Column(Integer, ForeignKey("Residencias.ID_Residencia"))
    ID_EstadoCivil = Column(Integer, ForeignKey("EstadoCivil.ID_EstadoCivil"))
    EnTratamiento = Column(Boolean, nullable=False)
    TomaMedicamentos = Column(Enum('Sí', 'No', 'No aplica'), nullable=False)
    nombre_medicacion = Column(String(255))

# Modelos de Pydantic
class PacienteCreate(BaseModel):
    Nombre: str
    Correo: EmailStr
    Contraseña: str
    Sexo: Literal['Mujer', 'Hombre', 'Prefiero no decirlo']
    Edad: int
    ID_NivelEstudios: int
    ID_Ocupacion: int
    ID_Residencia: int
    ID_EstadoCivil: int
    EnTratamiento: bool
    TomaMedicamentos: Literal['Sí', 'No', 'No aplica']
    nombre_medicacion: Optional[str]

class PacienteResponse(BaseModel):
    ID_Paciente: int
    Nombre: str
    Correo: EmailStr
    Sexo: Literal['Mujer', 'Hombre', 'Prefiero no decirlo']
    Edad: int
    ID_NivelEstudios: int
    ID_Ocupacion: int
    ID_Residencia: int
    ID_EstadoCivil: int
    EnTratamiento: bool
    TomaMedicamentos: Literal['Sí', 'No', 'No aplica']
    nombre_medicacion: Optional[str]

# Crear la instancia de FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir cualquier origen, puedes restringirlo a una URL específica
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Dependencia para la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint para registrar un paciente
@app.post("/pacientes/", response_model=PacienteResponse)
def registrar_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    nuevo_paciente = Pacientes(
        Nombre=paciente.Nombre,
        Correo=paciente.Correo,
        Contraseña=paciente.Contraseña,
        Sexo=paciente.Sexo,
        Edad=paciente.Edad,
        ID_NivelEstudios=paciente.ID_NivelEstudios,
        ID_Ocupacion=paciente.ID_Ocupacion,
        ID_Residencia=paciente.ID_Residencia,
        ID_EstadoCivil=paciente.ID_EstadoCivil,
        EnTratamiento=paciente.EnTratamiento,
        TomaMedicamentos=paciente.TomaMedicamentos,
        nombre_medicacion=paciente.nombre_medicacion
    )
    try:
        db.add(nuevo_paciente)
        db.commit()
        db.refresh(nuevo_paciente)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Correo ya registrado o datos inválidos.")
    
    return PacienteResponse(
        ID_Paciente=nuevo_paciente.ID_Paciente,
        Nombre=nuevo_paciente.Nombre,
        Correo=nuevo_paciente.Correo,
        Sexo=nuevo_paciente.Sexo,
        Edad=nuevo_paciente.Edad,
        ID_NivelEstudios=nuevo_paciente.ID_NivelEstudios,
        ID_Ocupacion=nuevo_paciente.ID_Ocupacion,
        ID_Residencia=nuevo_paciente.ID_Residencia,
        ID_EstadoCivil=nuevo_paciente.ID_EstadoCivil,
        EnTratamiento=nuevo_paciente.EnTratamiento,
        TomaMedicamentos=nuevo_paciente.TomaMedicamentos,
        nombre_medicacion=nuevo_paciente.nombre_medicacion
    )
