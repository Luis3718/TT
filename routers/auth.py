from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from itsdangerous import URLSafeTimedSerializer
from correo import verificar_token_verificacion
from sqlalchemy.orm import Session
from database import get_db
from models import Paciente
from pydantic import BaseModel
import hashlib

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

class LoginRequest(BaseModel):
    Correo: str
    Contraseña: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Paciente).filter(Paciente.Correo == request.Correo).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    hashed_password = hashlib.sha256(request.Contraseña.encode("utf-8")).hexdigest()
    if usuario.Contraseña != hashed_password:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    if not usuario.EsApto:
        raise HTTPException(status_code=403, detail="No estás autorizado para usar el sistema")

    if not usuario.CorreoVerificado:
        raise HTTPException(status_code=403, detail="Debes verificar tu correo para usar el sistema")

    return {"message": "Login exitoso"}

@router.get("/verify")
def verificar_correo(token: str, db: Session = Depends(get_db)):
    correo = verificar_token_verificacion(token)
    if not correo:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    usuario = db.query(Paciente).filter(Paciente.Correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.CorreoVerificado = True
    db.commit()
    content = open("verify_success.html", encoding="utf-8").read()
    return HTMLResponse(content=content, status_code=200)