
# Comisiones Jerárquicas

Aplicación web para la gestión y asignación de esquemas de comisiones sobre una estructura jerárquica de regiones, rutas, circuitos y puntos de venta (PDVs).

## Descripción
Permite seleccionar elementos de una jerarquía (región, ruta, circuito, PDV), asignarles un esquema de comisión y una categoría, visualizar la selección y exportar los datos en formato JSON. Incluye buscador, selección múltiple, y visualización clara de los elementos seleccionados.

## Características principales
- Visualización de árbol jerárquico de regiones, rutas, circuitos y PDVs.
- Asignación de esquemas de comisión y categorías a cualquier nivel.
- Buscador por nombre o código.
- Selección múltiple y agrupada.
- Exportación de la selección a archivo JSON.
- Interfaz moderna con Bootstrap 5 y Bootstrap Icons.

## Estructura de archivos
- `index.html`: Interfaz principal de la aplicación.
- `app.js`: Lógica principal de la aplicación y manejo de eventos.
- `data.js`: Datos de la jerarquía (regiones, rutas, circuitos, PDVs).
- `esquemas.js`: Definición de los esquemas de comisión disponibles.
- `categorias.js`: Definición de las categorías disponibles.
- `styles.css`: Estilos personalizados para la visualización del árbol y la selección.

## Instalación y uso
1. Clona o descarga este repositorio.
2. Abre `index.html` en tu navegador web (no requiere servidor, todo es local).
3. Utiliza la interfaz para seleccionar elementos, asignar esquemas y categorías, y exportar la selección.

## Dependencias
- [Bootstrap 5](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
Ambas se cargan desde CDN en el HTML.

## Ejemplo de uso
1. Haz clic en el botón **+** para abrir el modal de selección.
2. Elige el nivel (región, ruta, circuito, PDV), el esquema de comisión y la categoría.
3. Busca y selecciona los elementos deseados.
4. Carga el árbol y revisa la selección en el panel derecho.
5. Haz clic en **Guardar Selección** para exportar los datos.

## Autor
Desarrollado por Juan Felipe Builes.

## Licencia
Uso personal o educativo. Puedes modificar y adaptar el código según tus necesidades.
