from pydantic import BaseModel
from typing import Optional

class PacienteCreate(BaseModel):
    nombre: str
    nombre_usuario: str
    contraseña: str
    sexo: str
    edad: int
    en_tratamiento: bool
    toma_medicacion: str
    nombre_medicacion: Optional[str]

class PacienteLogin(BaseModel):
    nombre_usuario: str
    contraseña: str
