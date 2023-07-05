import { Router } from "express"
import fs from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"


const __dirname = dirname(fileURLToPath(import.meta.url))

const rutaPosteos = join(__dirname, "..", 'publicaciones.json'); //Obtenemos la ruta del archivo JSON que funge como Base de Dato artificial.
let datosPosteos = fs.readFileSync(rutaPosteos); //"readFileSync" lee archivos de forma sincrona, es decir, hace que Node.js frene otros procesos paralelos para que haga este.
datosPosteos = JSON.parse(datosPosteos); //"parse" transforma una cadena de caracteres a un objeto JSON.
console.log(datosPosteos); //Imprimimos el contenido extraido del archivo JSON.

const router = Router()

router.get('/', (req, res) => res.render("index", { publicaciones: datosPosteos }));

router.get('/about', (req, res) => res.render("about"));

router.get('/contact', (req, res) => res.render("contact"));

router.get('/posts/:handle', (req, res) => { //Manejamos la URL que navegan los usuarios.
    const handle = req.params.handle; //Guardamos el handle que viene de la URL.
    const publicacion = datosPosteos.find((item) => item.handle === handle); //Ver si el handle URL que viene de la petición con el handle del archivo JSON. Da True o False.
    if(publicacion){ //Si el handle de la petición se encuentra en el archivo JSON, es decir, que sea "true", entonces...
        const rutaArchivoPublicacion = join(__dirname, "..", "views", "posts", `${handle}.ejs`); //Encontramos ruta del archivo del handle encontrado.
        if (fs.existsSync(rutaArchivoPublicacion)){ //Si el archivo "HTML" (.ejs) se encuentra entonces...
            return res.render(rutaArchivoPublicacion); //Renderiza el archivo HTML.
        }
        else{ //Si el archivo no existe entonces... 
            const contenidoHTML = `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${publicacion.titulo}</title>
                    <%- include('../partials/header') %>
                </head>
                <body>
                    <%- include('../partials/navegacion') %>
                    <div class="contenedor-global container pt-2 text-center d-flex justify-content-center align-items-center vh-100 flex-column">
                        <h1>${publicacion.titulo}</h1>
                        <p>${publicacion.descripcion}</p>
                    </div>
                    
                    <%- include('../partials/footer') %>
                </body>
            </html>`;
            
            fs.writeFile(rutaArchivoPublicacion, contenidoHTML, (error) => { //Se crea el archivo en la ruta especificada y se coloca el contenido al archivo.
                if(error){ //Si hay un error al crear el documento HTML entonces...
                    console.error("Ocurrió un error al crear el documento de la publicación. Error: ",  error); //Imprimimos en la consola el error.
                    res.sendStatus(500); //Responde con el estado 500.
                }
                else{ //Si se crea exitosamente entonces...
                    res.render(rutaArchivoPublicacion); //Renderiza el archivo creado.
                }
            });
        }
    }
    else{ //Si el handle de la URL no está en la DB entonces...
        console.log("El contenido no está disponible");
        res.status(404).send("¡El recurso al que está intentando acceder no está disponible!"); //Responde con el estado 404.
    }
});

export default router

