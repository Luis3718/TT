from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import Paciente
from schemas import PacienteCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_paciente(db: Session, paciente: PacienteCreate):
    hashed_password = get_password_hash(paciente.contraseña)
    db_paciente = Paciente(
        nombre=paciente.nombre,
        nombre_usuario=paciente.nombre_usuario,
        contraseña=hashed_password,
        sexo=paciente.sexo,
        edad=paciente.edad,
        en_tratamiento=paciente.en_tratamiento,
        toma_medicacion=paciente.toma_medicacion,
        nombre_medicacion=paciente.nombre_medicacion
    )
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

def authenticate_paciente(db: Session, nombre_usuario: str, password: str):
    db_paciente = db.query(Paciente).filter(Paciente.nombre_usuario == nombre_usuario).first()
    if db_paciente and verify_password(password, db_paciente.contraseña):
        return db_paciente
    return None
