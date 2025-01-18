from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import pacientes  # Importa los endpoints desde la carpeta routers

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las URLs de origen
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

# Incluye los routers
app.include_router(pacientes.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de SerenaMente"}
