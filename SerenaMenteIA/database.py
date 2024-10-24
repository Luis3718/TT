from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# Configura tu URL de conexión según sea necesario
DATABASE_URL = "mysql+mysqlconnector://root:root@localhost/telepsicologia"

# Crear el motor de conexión
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Prueba de Conexión a la Base de Datos
def test_connection():
    try:
        # Crear una sesión de prueba para ver si se conecta sin problemas
        db = SessionLocal()
        result = db.execute(text("SHOW TABLES"))
        tables = result.fetchall()
        if tables:
            print("Tablas en la base de datos:")
            for table in tables:
                print(table[0])
        else:
            print("No se encontraron tablas en la base de datos.")
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_connection()
