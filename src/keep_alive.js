const http = require('http');

const guiaContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Salduie Assistant BOT</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table, th, td {
            border: 1px solid #ccc;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <h1>Salduie Assistant BOT</h1>
    <h2>Banco de semillas en Discord</h2>

    <p>
        Este bot de Discord permite gestionar un banco de semillas en una hoja de cálculo de Google Sheets. Los usuarios pueden añadir semillas y listar las semillas existentes con diversas opciones de filtrado.
    </p>

    <h3>Comandos</h3>

    <h4>/add</h4>
    <p>
        Añade una entrada al banco de semillas.
    </p>

    <h4>Parámetros</h4>
    <ul>
        <li><code>user</code> (Usuario, requerido): El usuario que añade la semilla.</li>
        <li><code>type</code> (Tipo, requerido): Tipo de entrada (semilla o esqueje).</li>
        <li><code>location</code> (Lugar de recolección, requerido): El lugar de recolección.</li>
        <li><code>seed</code> (Semilla, requerido): La semilla a añadir.</li>
        <li><code>variety</code> (Variedad, requerido): La variedad de la semilla.</li>
        <li><code>scientific_name</code> (Nombre científico, requerido): El nombre científico de la planta.</li>
        <li><code>harvest_year</code> (Año de recolección, requerido): El año de recolección.</li>
        <li><code>observations</code> (Observaciones, opcional): Observaciones adicionales.</li>
        <li><code>image_url</code> (URL de la imagen, opcional): URL de la imagen de la planta.</li>
    </ul>

    <h4>Ejemplo de Uso</h4>
    <pre>/add user: @Usuario type: Semilla location: España seed: Tomate variety: Cherry scientific_name: Solanum lycopersicum harvest_year: 2023 observations: Muy dulce image_url: https://example.com/image.jpg</pre>

    <h4>/list</h4>
    <p>
        Muestra todos los usuarios agregados a la lista de semillas con opción de filtrado.
    </p>

    <h4>Parámetros</h4>
    <ul>
        <li><code>filter</code> (Filtro, opcional): Filtra los resultados por un criterio específico.</li>
    </ul>

    <h4>Ejemplo de Uso</h4>
    <pre>/list filter: Tomate</pre>

    <h3>Ejemplo de Datos en la Hoja de Cálculo</h3>

    <p>
        A continuación, se muestra un ejemplo de cómo se estructuran los datos en la hoja de cálculo de Google Sheets:
    </p>

    <table>
        <tr>
            <th>Usuario</th>
            <th>Tipo</th>
            <th>Semilla</th>
            <th>Variedad</th>
            <th>Nombre científico</th>
            <th>Año de recolección</th>
            <th>Lugar de recolección</th>
            <th>Observaciones</th>
            <th>Imágenes</th>
        </tr>
        <tr>
            <td>usuario1</td>
            <td>Semilla</td>
            <td>Pimientos</td>
            <td>-</td>
            <td>Capsicum annuum</td>
            <td>2023</td>
            <td>España</td>
            <td>Variante dulce</td>
            <td></td>
        </tr>
        <tr>
            <td>usuario2</td>
            <td>Esqueje</td>
            <td>Tomate</td>
            <td>Cherry Pera Amarillo</td>
            <td>Solanum lycopersicum</td>
            <td>2024</td>
            <td>España</td>
            <td></td>
            <td><img src="https://cdn.discordapp.com/attachments/.../5.tomateCherryPeraAmarillo.jpg" alt="Tomate Cherry Pera Amarillo"></td>
        </tr>
    </table>

    <h3>Notas Adicionales</h3>
    <ul>
        <li>Los usuarios pueden añadir múltiples entradas, incluso si ya han añadido una entrada previamente.</li>
        <li>Se puede utilizar el comando <code>/list</code> para filtrar las semillas por cualquier campo disponible.</li>
        <li>Asegúrate de proporcionar una URL válida para la imagen si decides incluir una.</li>
    </ul>

    <h3>Requisitos</h3>
    <ul>
        <li>Tener permisos de Cultivador para añadir entradas y ver el listado.</li>
        <li>Acceso a una hoja de cálculo de Google Sheets configurada para permitir la escritura a través de la API de Google Sheets.</li>
    </ul>

    <h3>Contacto</h3>
    <p>Para cualquier duda o soporte técnico, contacta con ecohuertosalduie dentro del servidor de Discord.</p>

    <hr>

    <p>¡Gracias por usar nuestro bot!</p>
</body>
</html>
`;

const server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.write(guiaContent);
  res.end();
});

server.listen(8080, () => {
  console.log('Servidor HTTP iniciado en el puerto 8080');
});
