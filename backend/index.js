import  express  from "express";
import cookieParser from 'cookie-parser';
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {methods as authentication} from "./controllers/authentication.controller.js"
import {methods as authorization} from "./middlewares/authorization.js";
import cors from 'cors';

const app = express();
const corsOptions = {
  origin: 'https://sistemadeloginfrontend.vercel.app', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
};

app.use(cors(corsOptions));
app.set("port", process.env.PORT || 4000); 
app.listen(app.get("port"), () => {
  console.log("Servidor corriendo en puerto", app.get("port"));
});


app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/assets"));
app.use(express.json());
app.use(cookieParser());

app.get("/login",authorization.soloPublico, (req,res)=> res.send());
app.get("/register",authorization.soloPublico,(req,res)=> res.send);
app.get("/admin",authorization.soloAdmin,(req,res)=> res.send);
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);