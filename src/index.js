// Servidor Express

// Para probar los ficheros estáticos del fronend, entrar en <http://localhost:4500/>
// Para probar el API, entrar en <http://localhost:4500/api/items>

// Imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config()



// Arracar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({limit: "25mb"}));


// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection(
    {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS,  // <-- Pon aquí tu contraseña o en el fichero /.env en la carpeta raíz
      database: process.env.DB_NAME || "Clase",
    }
  );

  connection.connect();

  return connection;
}


// Poner a escuchar el servidor

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Ya se ha arrancado nuestro servidor: http://localhost:${port}/`);
});


// Endpoints

//Obtener todas las recetas
// GET /recetas


server.get('/recetas', async (req, res) => {

  const selectAllRec= 'SELECT * FROM recetas';
  const conn = await getConnection();
  const [result] = await conn.query(selectAllRec);
  conn.end();
  res.json({
    info: { 
      count: result.length,
    }, 
    results: result 
 });
});

// Obtener una recepta por su ID
//GET /recetas/:id

server.get('/recetas/:id', async (req, res) => {

  const id = req.params.id;
  const select = 'SELECT * FROM recetas WHERE id = ?';
  const conn = await getConnection();
  const [result] = await conn.query(select, id);
  //console.log(result);
  conn.end();
  res.json(
    result [0]
  );
});


// Crear una nueva receta 
//POST /recetas

server.post('/recetas', async (req, res)=> {
  const  newRecipe = req.body
  try {
    const insert = 
    'INSERT INTO recetas (nombre, ingredientes, instrucciones) VALUES (?,?,?)'
    const conn = await getConnection();
    const [result] = await conn.query(insert, [
      newRecipe.nombre,
      newRecipe.ingredientes,
      newRecipe.instrucciones,
    ]);
    conn.end();
    res.json({
      success: true,
      id: result.inserId
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Ha ocurrido un error, revise los campos'
    });
  }
});