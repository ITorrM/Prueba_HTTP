import socket
import select
import os
import sys
import mimetypes
import time
import ssl

#Configuramons el gateway y puerto
SERVER_HOST = '127.0.0.1'
SERVER_PORT = 8080

#######################################################
#Definimos el contexto SSL para conexiones seguras
context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.load_cert_chain('ssl/cert.pem', 'ssl/key.pem')

# Creamos el socket (para version HTTP 2.0 para abajo se usa TCP)
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#int setsockopt(int socket, int level, int option_name,  const void *option_value, socklen_t option_len);
#Trabajamos a nivel de socket luego definimos *option_name=SOL_SOCKET, SO_REUSEADDR para reciclar
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_socket.bind((SERVER_HOST, SERVER_PORT))
server_socket.listen(5)


# Lista de sockets para monitorear
lista = [server_socket]


# Funcion para manejar las solicitudes HTTP
def peticion(client_socket):
    peticion = client_socket.recv(1024).decode('utf-8')
    print(f"Solicitud recibida: {peticion}")

    # Extraemos la ruta del archivo de la solicitud
    lines = peticion.split('\r\n')
    for line in lines:
        if line.startswith('GET'):
            filename = line.split(' ')[1]
            break
    else:
        filename = 'index.html' #Si no existe el archivo, se manda la pagina principal por defecto

    # Asignamos el archivo solicitado
    respuesta = objetos(filename)

    # Anyadimos la hoja de estilo CSS al final de la respuesta
    css_directorio = 'css/iroom.css'
    hoja_css = objetos(css_directorio)
    respuesta += hoja_css

    client_socket.send(respuesta)

    # Verificamos si la solicitud es persistente
    keep_alive = any(line.strip().lower() == 'connection: keep-alive' for line in lines)
    if not keep_alive:
        print("Cerrando conexion")
        client_socket.close()
        lista.remove(client_socket)

def objetos(archivo):
    www_dir = os.path.join(os.path.dirname(__file__), 'www')
    directorio = os.path.join(www_dir, archivo.lstrip('/')) #Marcamos que hay varios directorios

    if os.path.exists(directorio):
        tipo_contenido, _ = mimetypes.guess_type(directorio)
        with open(directorio, 'rb') as file:
            contenido = file.read()

        cabeceras= f"HTTP/1.1 200 OK\r\nContent-Type: {tipo_contenido}\r\nContent-Length: {len(contenido)}\r\n\r\n".encode('utf-8')
        return cabeceras + contenido
    else:
        return "HTTP/1.1 404 Not Found\r\n\r\n<html><body><h1>404 Archivo no encontrado</h1></body></html>\r\n".encode('utf-8')

# Bucle principal del servidor
while True:
    start_time = time.time()
    # Usamos select para monitorear multiples sockets con puertos distintos
    lectura_socket, _, _ = select.select(lista, [], []) #Solo se usa la lista de sockets para lectura

    for entrada_socket in lectura_socket:
        # Si es el socket del servidor, aceptamos una nueva conexion
        if entrada_socket == server_socket:
            client_socket, client_address = server_socket.accept()
            print(f"Conexion desde {client_address}")
            # Envolver el socket del cliente con SSL/TLS
            client_socket_ssl = context.wrap_socket(client_socket, server_side=True)
            lista.append(client_socket_ssl)
        # Si es un socket de cliente, procesamos la peticion
        else:
            peticion(entrada_socket)
    # Verificar si el servidor ha estado inactivo durante 10 segundos
    current_time = time.time()
    if current_time - start_time >= 10:
        server_socket.close()
        print("Servidor web inactivo")
        break




