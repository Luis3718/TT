from sqlalchemy import Column, Integer, String, Enum, Boolean
from database import Base

class Paciente(Base):
    __tablename__ = "Pacientes"

    id_paciente = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    nombre_usuario = Column(String, unique=True, nullable=False)
    contraseña = Column(String, nullable=False)
    sexo = Column(Enum('Mujer', 'Hombre', 'Prefiero no decirlo'), nullable=False)
    edad = Column(Integer, nullable=False)
    en_tratamiento = Column(Boolean, nullable=False)
    toma_medicacion = Column(Enum('Sí', 'No', 'No aplica'), nullable=False)
    nombre_medicacion = Column(String)
