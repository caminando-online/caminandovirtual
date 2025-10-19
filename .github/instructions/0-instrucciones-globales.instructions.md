# Instrucciones Globales para Desarrollo con Vibe Coding

Estas instrucciones globales rigen el proceso de desarrollo en cualquier proyecto utilizando el enfoque de Vibe Coding. El objetivo es mantener un entorno ordenado, eficiente y reproducible.

## Regla de Nombres en Inglés

Para mantener coherencia y facilitar la colaboración, todos los nombres de archivos, variables, funciones, clases, colecciones de bases de datos, rutas de API, mensajes de commit, etc., deben estar en inglés. Consulta `glosario.md` para traducciones comunes y ejemplos. La IA debe traducir automáticamente cualquier referencia en español al inglés para el código o archivos.

## Estructura de Carpetas

Para organizar el proyecto de manera modular y eficiente, utiliza las siguientes carpetas principales:

- **0-temps/**: Scripts temporales de un solo uso para chequeos, pruebas o populación de bases de datos. Eliminar después de usar.
- **elements/**: Almacena archivos .md específicos de cada página o componente de la aplicación. Por ejemplo, `elements/home_page.md`, `elements/user_profile.md`. Incluye descripciones detalladas, wireframes y especificaciones para cada elemento visual o funcional.
- **process/**: Contiene scripts y archivos de automatización relacionados con el proceso de desarrollo. Por ejemplo, scripts de build, deployment, o utilidades para Vibe Coding (e.g., `process/deploy.sh`, `process/generate_mockup.py`).
- **Library/**: Documentación general, incluyendo este archivo y otros .md.
- **tests/**: Archivos de prueba, ubicados en la raíz del proyecto.

Mantén la estructura limpia y actualiza `registro-archivos.md` al agregar nuevos archivos.

## Registro de Archivos Incorporados

Cada archivo incorporado al proyecto después de ser aprobado en `prototypes`, debe tener un documento Markdown individual en la carpeta `Library/archivos/`. Este documento debe incluir:

```
# Desglose de Archivo: backend_api.py
- Mantener una estructura modular del proyecto: archivos más chicos y fácilmente identificables, en lugar de pocos archivos extensos. Esto facilita el procesamiento por parte de la IA y reduce errores en modificaciones.
- Documentar cambios en commits descriptivos.
- Registrar descripciones y dependencias de archivos en `registro-archivos.md`.

## Recreación
1. Crear archivo en `src/backend/api.py`.
2. Importar dependencias: `from flask import Blueprint, request`.
3. Definir rutas: `@api.route('/users', methods=['GET'])`.
4. Implementar lógica de autenticación y respuesta JSON.
```

Estos documentos deben mantenerse actualizados y permitir que una nueva sesión de IA recree el desarrollo leyendo solo estos archivos.

## Registro de Puertos

Mantener un registro actualizado de puertos en `puertos.md` para evitar interferencias. Asignar puertos según rangos definidos:

- Frontend producción: X000
- Backend producción: Y000

Antes de iniciar cualquier servidor, verificar que el puerto esté libre y actualizar la tabla en `puertos.md`.

## Documentación del Proceso

Después de aprobar una nueva feature, documentar el proceso completo en `proceso.md`. Este archivo debe incluir:

1. **Integración Final**: Movimiento a la estructura principal y ajustes.
2. **Testing**: Ejecución de tests y validación.
3. **Documentación**: Actualización de `Library/archivos/` y este `proceso.md`.

Mantener `proceso.md` actualizado con cada nueva feature para un registro cronológico. Consulta `proceso-creativo.md` para el enfoque visual en desarrollo.

## Interacción con la IA

- La IA debe seguir las instrucciones directamente sin explicaciones paso a paso sobre el proceso de desarrollo. Generar código, modificaciones o acciones de inmediato para optimizar el uso de créditos.
- Solo responder con texto cuando se le haga una pregunta explícita. De lo contrario, proceder con la tarea asignada silenciosamente.

## Buenas Prácticas Generales

- Todos los scripts temporales de un solo uso (chequeo de bases de datos, pruebas de funcionamientos, populación de datos, etc.) deben crearse en la carpeta `0-temps/` y eliminarse inmediatamente después de su uso.
- Mantener una estructura modular del proyecto: archivos más chicos y fácilmente identificables, en lugar de pocos archivos extensos. Esto facilita el procesamiento por parte de la IA y reduce errores en modificaciones.
- Usar control de versiones con Git, ignorando entornos virtuales y `tests/` si no es necesario.
- Documentar cambios en commits descriptivos.
- Registrar descripciones y dependencias de archivos en `registro-archivos.md`.
- Gestionar bases de datos según `base-datos.md` para conexiones seguras y arquitectura evolutiva.
- Implementar seguridad según `seguridad.md` para prevenir vulnerabilidades en datos sensibles.
- Utilizar únicamente el entorno virtual de Python ubicado en la raíz del proyecto (`venv/`). No crear entornos virtuales duplicados en subdirectorios para evitar conflictos y mantener consistencia en las dependencias.

## Asignación de Nombres en Inglés

Para mantener coherencia y facilitar la colaboración internacional, todos los nombres utilizados en el desarrollo deben estar en inglés, independientemente del idioma en que se refiera el usuario. Esto incluye:

- **Nombres de archivos**: Ej. `user_model.py` en lugar de `modelo_usuario.py`.
- **Variables y funciones**: Ej. `user_name` en lugar de `nombre_usuario`.
- **Colecciones en bases de datos**: Ej. `users` en lugar de `usuarios`.
- **Clases y métodos**: Ej. `UserService` en lugar de `ServicioUsuario`.
- **Comentarios y documentación**: Preferiblemente en inglés, salvo excepciones justificadas.

Si el usuario se refiere a un término en español, la IA debe traducirlo automáticamente al inglés para asignar el nombre correspondiente. Utilizar `glosario.md` para registrar traducciones y términos clave, asegurando que cualquier inconsistencia se resuelva proactivamente.

Esta regla aplica a todo el código, documentación y estructura del proyecto, promoviendo un estándar profesional y evitando confusiones lingüísticas.
