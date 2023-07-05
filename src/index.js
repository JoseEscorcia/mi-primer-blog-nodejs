import misRutas from "./routes/index.js"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import ejs from "ejs"
import express from "express"


const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url))
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(misRutas);

app.use(express.static(join(__dirname, 'public')));

app.listen(process.env.PORT || 3000);
console.log("Servidor escuchando en el puerto:", process.env.PORT || 3000);

