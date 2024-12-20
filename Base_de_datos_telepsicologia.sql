-- Creación de la base de datos
CREATE DATABASE Telepsicologia;
USE Telepsicologia;

-- Tabla de NivelesEstudios (Datos Iniciales)
CREATE TABLE NivelesEstudios (
    ID_NivelEstudios INT PRIMARY KEY,
    NivelEstudios VARCHAR(100) NOT NULL
);

-- Tabla de Ocupaciones (Datos Iniciales)
CREATE TABLE Ocupaciones (
    ID_Ocupacion INT PRIMARY KEY,
    Ocupacion VARCHAR(100) NOT NULL
);

-- Tabla de Residencias (Datos Iniciales)
CREATE TABLE Residencias (
    ID_Residencia INT PRIMARY KEY,
    Residencia VARCHAR(100) NOT NULL
);

-- Tabla de EstadoCivil (Datos Iniciales)
CREATE TABLE EstadoCivil (
    ID_EstadoCivil INT PRIMARY KEY,
    Estado VARCHAR(50) NOT NULL
);

-- Tabla de Pacientes
CREATE TABLE Pacientes (
    ID_Paciente INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Correo VARCHAR(255) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL,
    Sexo ENUM('Mujer', 'Hombre', 'Prefiero no decirlo') NOT NULL,
    Edad INT NOT NULL,
    ID_NivelEstudios INT,
    ID_Ocupacion INT,
    ID_Residencia INT,
    ID_EstadoCivil INT,
    EnTratamiento BOOLEAN NOT NULL,
    TomaMedicamentos ENUM('Sí', 'No', 'No aplica') NOT NULL,
    nombre_medicacion VARCHAR(255),
    CONSTRAINT fk_nivel_estudios FOREIGN KEY (ID_NivelEstudios) REFERENCES NivelesEstudios(ID_NivelEstudios),
    CONSTRAINT fk_ocupacion FOREIGN KEY (ID_Ocupacion) REFERENCES Ocupaciones(ID_Ocupacion),
    CONSTRAINT fk_residencia FOREIGN KEY (ID_Residencia) REFERENCES Residencias(ID_Residencia),
    CONSTRAINT fk_estado_civil FOREIGN KEY (ID_EstadoCivil) REFERENCES EstadoCivil(ID_EstadoCivil)
);

-- Tabla de Tests
CREATE TABLE Tests (
    ID_Test INT AUTO_INCREMENT PRIMARY KEY,
    NombreTest VARCHAR(50) NOT NULL,
    Calificacion FLOAT
);

-- Tabla de RespuestasTest
CREATE TABLE RespuestasTest (
    ID_Respuesta INT AUTO_INCREMENT PRIMARY KEY,
    ID_Test INT,
    ID_Paciente INT,
    FechaRealizacion DATE NOT NULL,
    Respuestas TEXT NOT NULL,
    CONSTRAINT fk_test FOREIGN KEY (ID_Test) REFERENCES Tests(ID_Test),
    CONSTRAINT fk_paciente FOREIGN KEY (ID_Paciente) REFERENCES Pacientes(ID_Paciente)
);

-- Tabla de Tratamientos
CREATE TABLE Tratamientos (
    ID_Tratamiento INT AUTO_INCREMENT PRIMARY KEY,
    Nivel VARCHAR(50) NOT NULL,
    Identificador VARCHAR(50) UNIQUE NOT NULL,
    FechaInicio DATE NOT NULL,
    FechaFin DATE
);

-- Tabla de PacientesTratamientos (Relación Muchos a Muchos)
CREATE TABLE PacientesTratamientos (
    ID_Paciente INT,
    ID_Tratamiento INT,
    CONSTRAINT fk_paciente_trat FOREIGN KEY (ID_Paciente) REFERENCES Pacientes(ID_Paciente),
    CONSTRAINT fk_tratamiento_pac FOREIGN KEY (ID_Tratamiento) REFERENCES Tratamientos(ID_Tratamiento)
);

-- Tabla de Actividades
CREATE TABLE Actividades (
    ID_Actividad INT AUTO_INCREMENT PRIMARY KEY,
    ID_Tratamiento INT,
    NombreActividad VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Calificacion FLOAT,
    CONSTRAINT fk_actividad_tratamiento FOREIGN KEY (ID_Tratamiento) REFERENCES Tratamientos(ID_Tratamiento)
);

INSERT INTO NivelesEstudios (ID_NivelEstudios, NivelEstudios) VALUES
(1, 'No estudié'),
(2, 'Primaria'),
(3, 'Secundaria'),
(4, 'Preparatoria'),
(5, 'Licenciatura'),
(6, 'Maestría'),
(7, 'Doctorado'),
(8, 'Otro');

INSERT INTO Ocupaciones (ID_Ocupacion, Ocupacion) VALUES
(1, 'Encargado(a) del hogar'),
(2, 'Estudiante'),
(3, 'Empleado(a)'),
(4, 'Desempleado(a)'),
(5, 'Autoempleo'),
(6, 'Profesionista'),
(7, 'Jubilado(a)'),
(8, 'Otro');

INSERT INTO Residencias (ID_Residencia, Residencia) VALUES
(1, 'Aguascalientes'),
(2, 'Baja California'),
(3, 'Baja California Sur'),
(4, 'Campeche'),
(5, 'Chiapas'),
(6, 'Chihuahua'),
(7, 'Ciudad de México'),
(8, 'Coahuila'),
(9, 'Colima'),
(10, 'Durango'),
(11, 'Estado de México'),
(12, 'Guanajuato'),
(13, 'Guerrero'),
(14, 'Hidalgo'),
(15, 'Jalisco'),
(16, 'Michoacán'),
(17, 'Morelos'),
(18, 'Nayarit'),
(19, 'Nuevo León'),
(20, 'Oaxaca'),
(21, 'Puebla'),
(22, 'Querétaro'),
(23, 'Quintana Roo'),
(24, 'San Luis Potosí'),
(25, 'Sinaloa'),
(26, 'Sonora'),
(27, 'Tabasco'),
(28, 'Tamaulipas'),
(29, 'Tlaxcala'),
(30, 'Veracruz'),
(31, 'Yucatán'),
(32, 'Zacatecas'),
(33, 'Extranjero');

INSERT INTO EstadoCivil (ID_EstadoCivil, Estado) VALUES
(1, 'Soltero(a)'),
(2, 'Unión libre'),
(3, 'Casado(a)'),
(4, 'Divorciado(a)'),
(5, 'Separado(a)'),
(6, 'Viudo(a)'),
(7, 'Otro');


