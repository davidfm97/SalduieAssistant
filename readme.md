# Salduie Assistant BOT
##  Banco de semillas en discord

Este bot de Discord permite gestionar un banco de semillas en una hoja de cálculo de Google Sheets. Los usuarios pueden añadir semillas y listar las semillas existentes con diversas opciones de filtrado.

## Comandos

### `/add`

Añade una entrada al banco de semillas.

#### Parámetros

- `user` (Usuario, requerido): El usuario que añade la semilla.
- `seed` (Semilla, requerido): La semilla a añadir.
- `variety` (Variedad, requerido): La variedad de la semilla.
- `scientific_name` (Nombre científico, requerido): El nombre científico de la planta.
- `harvest_year` (Año de recolección, requerido): El año de recolección.
- `location` (Lugar de recolección, opcional): El lugar de recolección.
- `observations` (Observaciones, opcional): Observaciones adicionales.
- `image_url` (URL de la imagen, opcional): URL de la imagen de la planta.

#### Ejemplo de Uso
/add user: @Usuario seed: Tomate variety: Cherry scientific_name: Solanum lycopersicum harvest_year: 2023 location: Mi Jardín observations: Muy dulce image_url: https://example.com/image.jpg

### `/list`

Muestra todos los usuarios agregados a la lista de semillas con opción de filtrado.

#### Parámetros

- `filter` (Filtro, opcional): Filtra los resultados por un criterio específico.

#### Ejemplo de Uso
/list filter: Tomate

## Ejemplo de Datos en la Hoja de Cálculo

A continuación, se muestra un ejemplo de cómo se estructuran los datos en la hoja de cálculo de Google Sheets:

| Usuario            | Semilla   | Variedad              | Nombre científico       | Año de recolección | Lugar de recolección | Observaciones | Imágenes                                                                 |
|--------------------|-----------|-----------------------|-------------------------|--------------------|----------------------|---------------|-------------------------------------------------------------------------|
| usuario1           | Pimientos | -                     | Capsicum annuum         | 2023               |                      | Variante dulce |                                                                         |
| usuario2           | Tomate    | Cherry Pera Amarillo  | Solanum lycopersicum    | 2024               |                      |               | https://cdn.discordapp.com/attachments/.../5.tomateCherryPeraAmarillo.jpg |

## Notas Adicionales

- Los usuarios pueden añadir múltiples entradas, incluso si ya han añadido una entrada previamente.
- Se puede utilizar el comando `/list` para filtrar las semillas por cualquier campo disponible.
- Asegúrate de proporcionar una URL válida para la imagen si decides incluir una.

## Requisitos

- Tener permisos de Cultivador para añadir entradas y ver el listado.
- Acceso a una hoja de cálculo de Google Sheets configurada para permitir la escritura a través de la API de Google Sheets.

## Contacto

Para cualquier duda o soporte técnico, contacta con ecohuertosalduie dentro del servidor de Discord.
---

¡Gracias por usar nuestro bot!

