import hashlib  # Importar hashlib para el hash de contraseñas
import schemas
import models
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Paciente
from schemas import PacienteCreate, Paciente

router = APIRouter(
    prefix="/pacientes",
    tags=["Pacientes"]
)

def hash_password(password: str) -> str:
    """Función para hashear la contraseña usando SHA-256."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

@router.post("/", response_model=schemas.Paciente)
def crear_paciente(paciente: schemas.PacienteCreate, db: Session = Depends(get_db)):
    
    # Verificar si el correo ya está registrado
    db_paciente = db.query(models.Paciente).filter(models.Paciente.Correo == paciente.Correo).first()
    if db_paciente:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    # Hashear la contraseña
    hashed_password = hash_password(paciente.Contraseña)

    # Crear el nuevo paciente con la contraseña hasheada
    nuevo_paciente = models.Paciente(
        Nombre=paciente.Nombre,
        Apellidos=paciente.Apellidos,
        Correo=paciente.Correo,
        CorreoAlternativo=paciente.CorreoAlternativo,
        Contraseña=hashed_password,
        Celular=paciente.Celular,
        Sexo=paciente.Sexo,
        FechaNacimiento=paciente.FechaNacimiento,
        ID_NivelEstudios=paciente.ID_NivelEstudios,
        ID_Ocupacion=paciente.ID_Ocupacion,
        ID_Residencia=paciente.ID_Residencia,
        ID_EstadoCivil=paciente.ID_EstadoCivil,
        EnTratamiento=paciente.EnTratamiento,
        TomaMedicamentos=paciente.TomaMedicamentos,
        NombreMedicacion=paciente.NombreMedicacion,
        AvisoPrivacidad=paciente.AvisoPrivacidad,
        CartaConsentimiento=paciente.CartaConsentimiento,
    )

    db.add(nuevo_paciente)
    db.commit()
    db.refresh(nuevo_paciente)
    return nuevo_paciente

@router.get("/{paciente_id}", response_model=Paciente)
def obtener_paciente(paciente_id: int, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.ID_Paciente == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return paciente
