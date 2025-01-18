from pydantic import BaseModel, EmailStr
from datetime import date

class PacienteBase(BaseModel):
    Nombre: str
    Apellidos: str
    Correo: EmailStr
    CorreoAlternativo: EmailStr | None = None
    Celular: str
    Sexo: str
    FechaNacimiento: date
    ID_NivelEstudios: int
    ID_Ocupacion: int
    ID_Residencia: int
    ID_EstadoCivil: int
    EnTratamiento: str
    TomaMedicamentos: str | None = None
    NombreMedicacion: str | None = None
    AvisoPrivacidad: bool
    CartaConsentimiento: bool

class PacienteCreate(PacienteBase):
    Contraseña: str

class Paciente(PacienteBase):
    ID_Paciente: int

    class Config:
        orm_mode = True
