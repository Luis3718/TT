import mysql.connector
from mysql.connector import Error
import cgi
import json

# Conexión a la base de datos
def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='ansiedad_db',
            user='root',
            password='root'
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error al conectar a MySQL: {e}")
        return None

# Función para guardar todas las respuestas
def guardar_respuestas_todos_tests(respuestas):
    connection = connect_to_database()
    if connection:
        try:
            cursor = connection.cursor()

            # Guardar respuestas BAI
            query_bai = """
                INSERT INTO respuestas_bai (q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query_bai, (
                respuestas['bai']['q1'],
                respuestas['bai']['q2'],
                respuestas['bai']['q3'],
                respuestas['bai']['q4'],
                respuestas['bai']['q5'],
                respuestas['bai']['q6'],
                respuestas['bai']['q7'],
                respuestas['bai']['q8'],
                respuestas['bai']['q9'],
                respuestas['bai']['q10'],
                respuestas['bai']['q11'],
                respuestas['bai']['q12'],
                respuestas['bai']['q13'],
                respuestas['bai']['q14'],
                respuestas['bai']['q15'],
                respuestas['bai']['q16'],
                respuestas['bai']['q17'],
                respuestas['bai']['q18'],
                respuestas['bai']['q19'],
                respuestas['bai']['q20']
            ))

            # Aquí puedes añadir consultas similares para los otros tests
            # Por ejemplo:
            # query_otros = "INSERT INTO respuestas_otros (...) VALUES (...)"
            # cursor.execute(query_otros, (...))

            connection.commit()
            cursor.close()
            print("Content-Type: text/html")
            print()
            print("<h1>Respuestas guardadas con éxito</h1>")
        except Error as e:
            print(f"Error al insertar en MySQL: {e}")
        finally:
            if connection.is_connected():
                connection.close()

# Proceso del formulario: recibir datos acumulados de todos los tests
form = cgi.FieldStorage()
# Suponiendo que se envían todos los datos juntos como un JSON string
if "respuestas_json" in form:
    respuestas_json = form.getvalue("respuestas_json")
    respuestas = json.loads(respuestas_json)
    guardar_respuestas_todos_tests(respuestas)
