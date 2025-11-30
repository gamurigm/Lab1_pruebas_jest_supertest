 PARTE 1: Establecer la estructura del proyecto y configurar el ambiente de desarrollo


Paso 1: Estructura del proyecto.

a.	Se debe crear una estructura básica para un proyecto JS teniendo en cuenta:
•	Src
•	Routes
•	Controllers
•	Test
•	Archivos de configuración


Paso 2: Instalar las tecnologías necesarias para el ambiente de desarrollo y pruebas.

a.	Crear el archivo package.json ejecutando el siguiente comando: npm init 
b.	Instalar express: npm install express
c.	Instalar las librerías necesarias: npm install --save-dev jest supertest eslint


 PARTE 2: Creación de API de Gestión de Usuarios


Paso 1: Configurar el controlador. 

a.	Crear el archivo controllers/user.controller.js.
b.	Simular de una base de datos en memoria (arreglo).
c.	Función para devolver todos los usuarios almacenados.
d.	Función para crear un nuevo usuario si se proveen nombre y correo válidos.
e.	Generar una validación básica de entrada
f.	Crear un objeto usuario y añadirlo al arreglo de usuarios
g.	Responder con el usuario creado status 201
h.	Exportar las funciones creadas con module.exports.


Paso 2: Configurar las rutas del servidor.

a.	Crear el archivo routes/user.routes.js.
b.	Importar los módulos necesarios: express y funciones del controlador.
c.	Definir ruta GET para obtener todos los usuarios.
d.	Definir ruta POST para crear un nuevo usuario.
e.	Exportar el router con module.exports.


Paso 3: Configurar la entrada principal.

a.	Crear el archivo app.js.
b.	Importar los módulos necesarios: express y el archivo donde se manejarán las rutas user.routes.js.
c.	Crea una instancia de la aplicación Express
d.	Usar un middleware para parsear JSON del cuerpo de las solicitudes.
e.	Establecer la ruta base para los usuarios.
f.	Usar un manejador de rutas no encontradas (404).
g.	Exportar la instancia app para poder usarla en tests o en un archivo de servidor separado.


PARTE 3: Verificación y validación


Paso 1: Validación: Pruebas con Jest y Supertest. 

a.	Crear el archivo test/user.test.js.
b.	Importar el cliente HTTP son supertest para pruebas.
c.	Importar app Express.
d.	Crear prueba que GET devuelva lista vacía inicialmente.
e.	Crear prueba que POST cree un nuevo usuario correctamente
f.	Crear prueba que el endpoint rechace peticiones inválidas
g.	Ejecutar las pruebas con el comando: npm test


Paso 2: Verificación: ESLint.

a.	Crear el archivo eslint.config.js.
b.	Importar la configuración base de reglas recomendadas de ESLint para JavaScript.
c.	Exportar un arreglo de configuraciones específicas para ESLint.
d.	Configurar los archivos dentro de la carpeta src con extensión .js.
e.	Gestionar opciones del lenguaje para estos archivos.
f.	Crear reglas de ESLint que se aplicarán a estos archivos.



SECCIÓN DE PREGUNTAS/ACTIVIDADES

1.	Simular almacenamiento en memoria y listar usuarios
a.	Actividad: Implementar una ruta GET /users que retorne una lista de usuarios en memoria (array local).
b.	Prueba: Crear usuarios con POST /users y luego verificar el contenido de GET /users.
c.	Objetivo: Pruebas de flujo completo (end-to-end simulado).

2.	Verificar cobertura de pruebas con Jest
a.	Actividad: Ejecutar jest --coverage, analizar el reporte y agregar pruebas hasta lograr >90% de cobertura.
b.	Objetivo: Comprender el impacto de la cobertura y escribir pruebas adicionales.

 

