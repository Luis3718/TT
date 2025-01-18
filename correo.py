import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def enviar_correo_verificacion(correo):
    remitente = "tu-correo@example.com"
    destinatario = correo
    asunto = "Verificación de Registro"
    cuerpo = """
    Gracias por registrarte en SerenaMente IA.
    Haz clic en el enlace a continuación para verificar tu cuenta:
    http://tu-dominio.com/verificar?email={}
    """.format(correo)

    mensaje = MIMEMultipart()
    mensaje["From"] = remitente
    mensaje["To"] = destinatario
    mensaje["Subject"] = asunto
    mensaje.attach(MIMEText(cuerpo, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as servidor:
        servidor.starttls()
        servidor.login("tu-correo@example.com", "tu-contraseña")
        servidor.sendmail(remitente, destinatario, mensaje.as_string())
