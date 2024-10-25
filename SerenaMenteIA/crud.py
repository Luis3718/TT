from sqlalchemy.orm import Session
from models import Pacientes
from schemas import PacienteCreate

def crear_paciente(db: Session, paciente: PacienteCreate):
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
    db.add(nuevo_paciente)
    db.commit()
    db.refresh(nuevo_paciente)
    return nuevo_paciente
