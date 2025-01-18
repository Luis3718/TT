from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Paciente
from schemas import PacienteCreate, Paciente

router = APIRouter(
    prefix="/pacientes",
    tags=["Pacientes"]
)

@router.post("/", response_model=Paciente)
def crear_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    db_paciente = db.query(Paciente).filter(Paciente.Correo == paciente.Correo).first()
    if db_paciente:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    nuevo_paciente = Paciente(**paciente.dict())
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
