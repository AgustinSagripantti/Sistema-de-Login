# Sistema de Login

## Descripción
Este proyecto es un sistema de autenticación y login construido con Node.js y MySQL. Permite a los usuarios registrarse, iniciar sesión y gestionar su cuenta. Es ideal para aprender los conceptos básicos de la autenticación y cómo integrar una base de datos MySQL con una aplicación Node.js.

## Instalación
Para instalar y ejecutar este proyecto localmente, sigue estos pasos:

1. Clona el repositorio:
   ```sh
   git clone https://github.com/AgustinSagripantti/Sistema-de-Login.git
2. Clona el repositorio:
   ```sh
   cd Sistema-login
3. Instala las dependencias:
   ```sh
   npm install
4. Configura la base de dotos:
  - Crea una base de datos MySql
    - Crea una tabla con sus respectivos campos
      - Renombra el archivo .env.example a .env y configura tus credenciales de base de datos MySQL en él.
5. Inicia la aplicación:
    ```sh
    npm run dev
        
##Uso
Para utilizar el sistema de login, abre http://localhost:3000 en tu navegador. Aquí puedes registrarte, iniciar sesión y gestionar tu cuenta.

Rutas Principales
/register: Página de registro de usuarios.
/login: Página de inicio de sesión.
/admin: Página de perfil del usuario (requiere autenticación).

##Contribución
Las contribuciones son bienvenidas. Para hacerlo, sigue estos pasos:

1. Realiza un fork de este repositorio.
2. Crea una nueva rama:
   ```sh
    git checkout -b nombre-de-tu-rama
2. Realiza tus cambios y haz un commit:
   ```sh
    git commit -m "Descripción de los cambios"
3. Empuja a la rama:
    ```sh
    git push origin nombre-de-tu-rama
4. Abre una Pull Request.

##Contacto
Agustin Sagripantti - asagripantti@gmail.com
