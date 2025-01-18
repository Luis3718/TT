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
    EsApto: bool | None = None  # Nuevo campo agregado

class PacienteCreate(PacienteBase):
    Contraseña: str
    EsApto: bool | None = None  # Campo opcional pero no necesario en la entrada

class Paciente(PacienteBase):
    ID_Paciente: int

    class Config:
        from_attributes = True  # Esto habilita la conversión desde modelos de SQLAlchemy
