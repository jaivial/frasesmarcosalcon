# MarcosGoWeb

<div align="center">
  <img src="static/img/foto1.jpg" alt="MarcosGoWeb Logo" width="300"/>
</div>

## 🌐 English | [Español](#español)

## Overview

MarcosGoWeb is an elegant web application built with Go that displays a collection of phrases and poems by Marcos Alcón. The application presents the content in a beautiful, interactive book format with page-turning animations, creating an immersive reading experience.

### Features

- Interactive book interface with realistic page-turning effects
- Responsive design that works on various devices
- Beautiful typography and vintage book styling
- API endpoint to access the phrases data
- Multiple viewing modes (single page and book format)

### Technology Stack

- **Backend**: Go (Golang)
- **Frontend**: HTML, CSS, JavaScript
- **Libraries**: StPageFlip for page-turning effects
- **Icons**: Font Awesome

## Project Structure

```
marcosgoweb/
├── main.go                 # Main application entry point
├── go.mod                  # Go module definition
├── install_certbot.sh      # Script for SSL certificate installation
├── MARKDOWN/               # Source material
│   └── poemas_marcos_alcon.md  # Original phrases/poems in Markdown
├── static/                 # Static assets
│   ├── css/                # Stylesheet files
│   │   ├── style.css       # Main stylesheet
│   │   ├── book.css        # Book-specific styles
│   │   └── booklet.css     # Booklet format styles
│   ├── js/                 # JavaScript files
│   │   └── book.js         # Book interaction functionality
│   ├── img/                # Images
│   │   └── foto1.jpg       # Cover image
│   └── data/               # Application data
│       └── poems.json      # Collection of phrases/poems
├── templates/              # HTML templates
│   ├── index.html          # Main page template
│   ├── book.html           # Book view template (not served by any route)
│   └── book_single_page.html # Single page view template
└── server/                 # Duplicate go.mod only, no Go sources
```

## Installation and Setup

### Prerequisites

- Go 1.23.1 or higher
- A modern web browser

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/jaivial/frasesmarcosalcon.git
   cd frasesmarcosalcon
   ```

2. Run the application:
   ```bash
   go run main.go
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Development

### Requirements

- Go 1.23.1 or higher (the version declared in `go.mod`)
- A modern web browser
- An internet connection: the templates load Font Awesome from cdnjs and StPageFlip from unpkg, so offline the icons — and the page-turning effect on `/` — will not load

There is nothing to install beforehand: the module declares no external dependencies, so `go mod download` is not needed.

### Running the server

Start the application **from the repository root**:

```bash
go run main.go
```

Every path the application uses is relative to the current working directory (`static/data/poems.json`, `templates/`, `static/`). Starting it from any other directory aborts immediately with:

```
Error: JSON file not found at static/data/poems.json
```

### Verifying it works

The server listens on port `8080`:

- `http://localhost:8080/` — interactive book with page-turning effect
- `http://localhost:8080/book` — single page view
- `http://localhost:8080/static/css/style.css` — static assets
- The JSON API:
  ```bash
  curl http://localhost:8080/api/phrases
  ```

Any other path returns 404: the root handler serves `/` only and rejects everything else.

### Development loop

The templates and `static/data/poems.json` are re-read on every request, which means:

- Editing `templates/*.html`, `static/css/*`, `static/js/*` or `static/data/poems.json` only needs a browser refresh.
- Only changes to `main.go` require stopping the server (`Ctrl+C`) and running `go run main.go` again.

The repository ships no live-reload setup. Tools such as `air` or `reflex` work here, but you have to install and configure them yourself.

### Port

The port is hardcoded as `8080` in `main.go`. There is no flag or environment variable to override it, so changing it means editing that line.

### Building a local binary

```bash
go build -o marcosgoweb main.go
./marcosgoweb
```

The binary must also be started from the repository root, for the same reason as `go run`. The repository has no `.gitignore`, so the compiled binary shows up as an untracked file — do not commit it.

### Sanity checks

```bash
gofmt -l .
go vet .
```

There are no automated tests in the project yet, so `go test` has nothing to run.

### Gotchas

- `server/` contains only a duplicate `go.mod` declaring the same `marcosgoweb` module and no Go source file. It is not a separate service; building or running from inside it fails.
- `templates/book.html` exists but no route serves it — `/book` renders `templates/book_single_page.html`.
- `install_certbot.sh` is a production script (it uses `apt`, `systemctl` and a fixed domain). Do not run it in a development environment.

## API Endpoints

- `GET /` - Main page with interactive book
- `GET /book` - Single page book view
- `GET /api/phrases` - JSON API for all phrases

## Deployment

For HTTPS support, you can use the included certbot installation script:

```bash
chmod +x install_certbot.sh
./install_certbot.sh
```

## License

[MIT License](LICENSE)

---

<a name="español"></a>
# MarcosGoWeb

<div align="center">
  <img src="static/img/foto1.jpg" alt="MarcosGoWeb Logo" width="300"/>
</div>

## 🌐 [English](#marcosgoweb) | Español

## Descripción General

MarcosGoWeb es una elegante aplicación web construida con Go que muestra una colección de frases y poemas de Marcos Alcón. La aplicación presenta el contenido en un hermoso formato de libro interactivo con animaciones de paso de página, creando una experiencia de lectura inmersiva.

### Características

- Interfaz de libro interactiva con efectos realistas de paso de página
- Diseño responsivo que funciona en varios dispositivos
- Hermosa tipografía y estilo de libro vintage
- Punto de acceso API para acceder a los datos de las frases
- Múltiples modos de visualización (página única y formato de libro)

### Stack Tecnológico

- **Backend**: Go (Golang)
- **Frontend**: HTML, CSS, JavaScript
- **Bibliotecas**: StPageFlip para efectos de paso de página
- **Iconos**: Font Awesome

## Estructura del Proyecto

```
marcosgoweb/
├── main.go                 # Punto de entrada principal de la aplicación
├── go.mod                  # Definición del módulo Go
├── install_certbot.sh      # Script para la instalación de certificados SSL
├── MARKDOWN/               # Material de origen
│   └── poemas_marcos_alcon.md  # Frases/poemas originales en Markdown
├── static/                 # Activos estáticos
│   ├── css/                # Archivos de hoja de estilo
│   │   ├── style.css       # Hoja de estilo principal
│   │   ├── book.css        # Estilos específicos para el libro
│   │   └── booklet.css     # Estilos para el formato de folleto
│   ├── js/                 # Archivos JavaScript
│   │   └── book.js         # Funcionalidad de interacción del libro
│   ├── img/                # Imágenes
│   │   └── foto1.jpg       # Imagen de portada
│   └── data/               # Datos de la aplicación
│       └── poems.json      # Colección de frases/poemas
├── templates/              # Plantillas HTML
│   ├── index.html          # Plantilla de página principal
│   ├── book.html           # Plantilla de vista de libro (ninguna ruta la sirve)
│   └── book_single_page.html # Plantilla de vista de página única
└── server/                 # Solo un go.mod duplicado, sin fuentes Go
```

## Instalación y Configuración

### Requisitos Previos

- Go 1.23.1 o superior
- Un navegador web moderno

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jaivial/frasesmarcosalcon.git
   cd frasesmarcosalcon
   ```

2. Ejecutar la aplicación:
   ```bash
   go run main.go
   ```

3. Abrir el navegador y navegar a:
   ```
   http://localhost:8080
   ```

## Desarrollo

### Requisitos

- Go 1.23.1 o superior (la versión declarada en `go.mod`)
- Un navegador web moderno
- Conexión a internet: las plantillas cargan Font Awesome desde cdnjs y StPageFlip desde unpkg, así que sin conexión no se cargan los iconos ni el efecto de paso de página de `/`

No hay nada que instalar previamente: el módulo no declara dependencias externas, por lo que `go mod download` no es necesario.

### Ejecutar el servidor

Arranca la aplicación **desde la raíz del repositorio**:

```bash
go run main.go
```

Todas las rutas que usa la aplicación son relativas al directorio de trabajo actual (`static/data/poems.json`, `templates/`, `static/`). Arrancarla desde cualquier otro directorio aborta inmediatamente con:

```
Error: JSON file not found at static/data/poems.json
```

### Verificar que funciona

El servidor escucha en el puerto `8080`:

- `http://localhost:8080/` — libro interactivo con efecto de paso de página
- `http://localhost:8080/book` — vista de página única
- `http://localhost:8080/static/css/style.css` — activos estáticos
- La API JSON:
  ```bash
  curl http://localhost:8080/api/phrases
  ```

Cualquier otra ruta devuelve 404: el handler raíz sirve solo `/` y rechaza el resto.

### Ciclo de desarrollo

Las plantillas y `static/data/poems.json` se releen en cada petición, lo que significa que:

- Editar `templates/*.html`, `static/css/*`, `static/js/*` o `static/data/poems.json` solo requiere recargar el navegador.
- Únicamente los cambios en `main.go` obligan a parar el servidor (`Ctrl+C`) y volver a ejecutar `go run main.go`.

El repositorio no incluye ninguna configuración de recarga automática. Herramientas como `air` o `reflex` funcionan aquí, pero hay que instalarlas y configurarlas por tu cuenta.

### Puerto

El puerto está fijado a `8080` en `main.go`. No existe ningún flag ni variable de entorno para cambiarlo, así que modificarlo implica editar esa línea.

### Compilar un binario local

```bash
go build -o marcosgoweb main.go
./marcosgoweb
```

El binario también debe arrancarse desde la raíz del repositorio, por el mismo motivo que `go run`. El repositorio no tiene `.gitignore`, así que el binario compilado aparece como archivo sin seguimiento — no lo subas al repositorio.

### Comprobaciones básicas

```bash
gofmt -l .
go vet .
```

Todavía no hay tests automatizados en el proyecto, por lo que `go test` no tiene nada que ejecutar.

### Detalles a tener en cuenta

- `server/` contiene únicamente un `go.mod` duplicado que declara el mismo módulo `marcosgoweb` y ningún archivo Go. No es un servicio aparte; compilar o ejecutar desde dentro falla.
- `templates/book.html` existe, pero ninguna ruta lo sirve — `/book` renderiza `templates/book_single_page.html`.
- `install_certbot.sh` es un script de producción (usa `apt`, `systemctl` y un dominio fijo). No lo ejecutes en un entorno de desarrollo.

## Endpoints de la API

- `GET /` - Página principal con libro interactivo
- `GET /book` - Vista de libro en página única
- `GET /api/phrases` - API JSON para todas las frases

## Despliegue

Para soporte HTTPS, puedes usar el script de instalación de certbot incluido:

```bash
chmod +x install_certbot.sh
./install_certbot.sh
```

## Licencia

[Licencia MIT](LICENSE) 