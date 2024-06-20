const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer(function (req, res) {
  // Construye la ruta completa al archivo guia.md usando __dirname
 const filePath='/opt/render/project/src/guia.md'
  // Lee el contenido del archivo guia.md
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      console.error("Error al leer el archivo guia.md:", err);
      res.writeHead(500, {'Content-Type': 'text/html'});
      res.write('Error interno del servidor');
      return res.end();
    }

    // Envía el contenido del guia.md como respuesta
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

server.listen(8080, () => {
  console.log('Servidor HTTP iniciado en el puerto 8080');
});
