// Importaciones de módulos
import bcryptjs from "bcryptjs"; // Importa el módulo bcryptjs para el hashing de contraseñas
import jsonwebtoken from "jsonwebtoken"; // Importa el módulo jsonwebtoken para la generación y verificación de tokens JWT
import dotenv from "dotenv"; // Importa el módulo dotenv para cargar variables de entorno desde un archivo .env
import pool from "../config/db.js"; // Importa la configuración de la conexión a la base de datos desde el archivo db.js

dotenv.config(); // Carga las variables de entorno desde el archivo .env

// Función asíncrona para manejar el inicio de sesión
async function login(req, res) {
  console.log(req.body); // Imprime en consola el cuerpo de la solicitud (para depuración)
  const user = req.body.user; // Obtiene el nombre de usuario desde el cuerpo de la solicitud
  const password = req.body.password; // Obtiene la contraseña desde el cuerpo de la solicitud

  // Verifica si el usuario o la contraseña están ausentes en la solicitud
  if (!user || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  // Consulta la base de datos para obtener el usuario con el nombre de usuario proporcionado
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE user = ?', [user]);
  const usuarioAResvisar = rows[0]; // Obtiene el primer resultado de la consulta

  // Verifica si no se encontró ningún usuario con el nombre de usuario proporcionado
  if (!usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }

  // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
  const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);

  // Verifica si la contraseña proporcionada no coincide con la contraseña almacenada
  if (!loginCorrecto) {
    return res.status(400).send({ status: "Error", message: "Error durante login" });
  }

  // Genera un token JWT con la información del usuario y configura su expiración
  const token = jsonwebtoken.sign(
    { user: usuarioAResvisar.user },
    process.env.JWT_SECRET, // Usa la clave secreta JWT definida en las variables de entorno
    { expiresIn: process.env.JWT_EXPIRATION } // Define la expiración del token JWT desde las variables de entorno
  );

  // Configura las opciones para la cookie JWT que se enviará en la respuesta
  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), // Calcula la fecha de expiración de la cookie desde las variables de entorno
    path: "/" // Define el alcance de la cookie para todas las rutas del sitio
  };

  // Establece la cookie JWT en la respuesta HTTP
  res.cookie("jwt", token, cookieOption);

  // Envía una respuesta indicando que el usuario ha iniciado sesión correctamente y redirige a la página de administrador
  res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin" });
}

// Función asíncrona para manejar el registro de nuevos usuarios
async function register(req, res) {
  const user = req.body.user; // Obtiene el nombre de usuario desde el cuerpo de la solicitud
  const password = req.body.password; // Obtiene la contraseña desde el cuerpo de la solicitud
  const email = req.body.email; // Obtiene el correo electrónico desde el cuerpo de la solicitud

  // Verifica si algún campo necesario está ausente en la solicitud
  if (!user || !password || !email) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  // Consulta la base de datos para verificar si ya existe un usuario con el mismo nombre de usuario
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE user = ?', [user]);
  const usuarioAResvisar = rows[0]; // Obtiene el primer resultado de la consulta

  // Verifica si se encontró algún usuario con el mismo nombre de usuario en la base de datos
  if (usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: "Este usuario ya existe" });
  }

  // Genera un salt para el hashing de la contraseña
  const salt = await bcryptjs.genSalt(5);

  // Genera el hash de la contraseña del usuario
  const hashPassword = await bcryptjs.hash(password, salt);

  // Crea un objeto con la información del nuevo usuario para ser almacenado en la base de datos
  const nuevoUsuario = {
    user,
    email,
    password: hashPassword
  };

  // Inserta el nuevo usuario en la base de datos
  await pool.query('INSERT INTO usuarios (user, email, password) VALUES (?, ?, ?)', [user, email, hashPassword]);

  console.log(nuevoUsuario); // Imprime en consola la información del nuevo usuario creado (para depuración)

  // Envía una respuesta indicando que el usuario ha sido registrado correctamente y redirige a la página de inicio de sesión
  return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.user} agregado`, redirect: "/" });
}

// Exporta los métodos de este módulo para ser utilizados en otras partes de la aplicación
export const methods = {
  login,
  register
};
