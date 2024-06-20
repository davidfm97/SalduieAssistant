var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  // Lee el contenido del archivo README.md
  fs.readFile('/src/guia.md', 'utf8', function(err, data) {
    if (err) {
      console.error("Error al leer el archivo guia.md:", err);
      res.writeHead(500, {'Content-Type': 'text/html'});
      res.write('Error interno del servidor');
      return res.end();
    }

    // Envía el contenido del README.md como respuesta
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(8080);

console.log('Servidor HTTP iniciado en el puerto 8080');
