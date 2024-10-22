import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

// Middleware para verificar si el usuario está autenticado como administrador
async function soloAdmin(req, res, next) {
  const logueado = await revisarCookie(req);
  if (logueado) return next();
  res.redirect("index.html");
}

// Middleware para verificar si el usuario no está autenticado (público)
async function soloPublico(req, res, next) {
  const logueado = await revisarCookie(req);
  if (!logueado) return next();
  return res.status(200).json({ redirect: "/admin.html" });
}

// Función asíncrona para revisar la cookie JWT y verificar la autenticación del usuario
async function revisarCookie(req) {
  try {
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    console.log(decodificada);

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [decodificada.username]);
    const usuarioAResvisar = rows[0];

    console.log(usuarioAResvisar);

    if (!usuarioAResvisar) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Exporta los métodos de este módulo para ser utilizados como middlewares en otras partes de la aplicación
export const methods = {
  soloAdmin,
  soloPublico,
};
