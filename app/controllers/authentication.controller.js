// Importaciones de módulos
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

// Función asíncrona para manejar el inicio de sesión
async function login(req, res) {
  console.log(req.body);
  const username = req.body.user; // Obtiene el nombre de usuario desde el cuerpo de la solicitud
  const password = req.body.password;

  // Verifica si el usuario o la contraseña están ausentes en la solicitud
  if (!username || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  // Consulta la base de datos para obtener el usuario con el nombre de usuario proporcionado
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
  const usuarioAResvisar = rows[0];

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
    { username: usuarioAResvisar.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  // Configura las opciones para la cookie JWT que se enviará en la respuesta
  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/"
  };

  // Establece la cookie JWT en la respuesta HTTP
  res.cookie("jwt", token, cookieOption);

  // Envía una respuesta indicando que el usuario ha iniciado sesión correctamente y redirige a la página de administrador
  res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin" });
}

// Función asíncrona para manejar el registro de nuevos usuarios
async function register(req, res) {
  const username = req.body.user; // Obtiene el nombre de usuario desde el cuerpo de la solicitud
  const password = req.body.password;
  const email = req.body.email;

  // Verifica si algún campo necesario está ausente en la solicitud
  if (!username || !password || !email) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  // Consulta la base de datos para verificar si ya existe un usuario con el mismo nombre de usuario
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
  const usuarioAResvisar = rows[0];

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
    username,
    email,
    password: hashPassword
  };

  // Inserta el nuevo usuario en la base de datos
  await pool.query('INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)', [username, email, hashPassword]);

  console.log(nuevoUsuario);

  // Envía una respuesta indicando que el usuario ha sido registrado correctamente y redirige a la página de inicio de sesión
  return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.username} agregado`, redirect: "/" });
}

// Exporta los métodos de este módulo para ser utilizados en otras partes de la aplicación
export const methods = {
  login,
  register
};
