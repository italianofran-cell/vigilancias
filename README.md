# Catálogo de Textos

Proyecto React (Vite + Tailwind) listo para desplegar en Vercel.

## Cómo subirlo (desde el móvil o el ordenador)

### 1. Crear el repositorio en GitHub
1. Entra en github.com e inicia sesión (o créate una cuenta gratis).
2. Pulsa **"New repository"**.
3. Ponle un nombre, por ejemplo `catalogo-textos`, y pulsa **"Create repository"**.

### 2. Subir estos archivos
1. Dentro del repositorio recién creado, pulsa **"Add file" → "Upload files"**.
2. Arrastra (o selecciona desde el gestor de archivos del móvil) **todos** los archivos y carpetas de este proyecto, manteniendo la estructura de carpetas (especialmente la carpeta `src`).
3. Pulsa **"Commit changes"**.

### 3. Desplegar en Vercel
1. Entra en vercel.com e inicia sesión con tu cuenta de GitHub.
2. Pulsa **"Add New..." → "Project"**.
3. Selecciona el repositorio `catalogo-textos` que acabas de subir.
4. Vercel detecta automáticamente que es un proyecto Vite — no hay que tocar nada más.
5. Pulsa **"Deploy"**.
6. En 1-2 minutos te da una URL pública, algo como `catalogo-textos.vercel.app`.

### 4. Actualizaciones futuras
Cada vez que subas un archivo nuevo a GitHub (repitiendo el paso 2 sobre el archivo que cambie), Vercel vuelve a desplegar solo, y la URL pública queda actualizada en 1-2 minutos.

## Esa URL es la que necesitamos para el siguiente paso: la APK

Una vez tengas la URL pública de Vercel, pásamela y preparo el proyecto Android (Capacitor) que la carga en pantalla completa como si fuera una app nativa.
