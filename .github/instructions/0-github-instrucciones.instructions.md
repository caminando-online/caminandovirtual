# Instrucciones para Uso Correcto y Eficiente de GitHub

Este documento proporciona guías detalladas para utilizar Git y GitHub de manera eficiente en proyectos con Vibe Coding. Enfocado en un sistema robusto de commits y branches para facilitar reversiones, tracking y colaboración.

## Introducción a Git y GitHub

Git es un sistema de control de versiones que permite rastrear cambios en el código. GitHub es la plataforma para alojar repositorios, colaborar y gestionar proyectos. En Vibe Coding, usamos Git como checkpoints para preservar avances funcionales y revertir fallos sin perder trabajo.

- **Repositorio**: Espacio donde se almacena el código y su historial.
- **Commit**: Instantánea de cambios, usado como checkpoint.
- **Branch**: Rama independiente para desarrollar features sin afectar el código principal.
- **Merge/Pull Request**: Integrar cambios de una branch a otra, con revisión.

## Sistema de Commits

Los commits son checkpoints críticos. Cada commit debe representar un avance funcional o una corrección, permitiendo reversiones precisas.

### Convenciones de Mensajes de Commit
Usa mensajes descriptivos y estandarizados para identificar fácilmente el proceso. Incluye nomenclatura numérica para versionado y fácil referencia.

- **Formato**: `[Tipo][Número] Descripción breve (máx. 100 chars)`
  - Ejemplos:
    - `[FEAT-001] Agregar autenticación de usuario`
    - `[FIX-002] Corregir error en login`
    - `[REFACTOR-003] Optimizar código de API`
    - `[DOC-004] Actualizar documentación de puertos`
    - `[TEST-005] Agregar tests para nueva feature`
    - `[CHECKPOINT-006] Guardar progreso en desarrollo`

- **Nomenclatura Numérica**:
  - **[Número]**: Contador incremental por tipo o feature (e.g., FEAT-001, FEAT-002 para features consecutivas).
  - Para branches específicas: Usa prefijo de branch (e.g., en `feature/auth`, commits como [AUTH-001], [AUTH-002]).
  - Global: Mantén un contador en un archivo como `docs/commit-counter.txt` y actualízalo con cada commit.
  - Facilita referencias: "Revierte a [FEAT-005]" en lugar de hashes largos.

- **Tipos Comunes**:
  - `[FEAT]`: Nueva funcionalidad.
  - `[FIX]`: Corrección de bugs.
  - `[REFACTOR]`: Mejora de código sin cambiar funcionalidad.
  - `[DOC]`: Cambios en documentación.
  - `[TEST]`: Agregar o modificar tests.
  - `[CHECKPOINT]`: Checkpoints claves cuando un desarrollo esta completamente terminado y funcional
  - `[MERGE]`: Integración de branches.

- **Frecuencia**: Guarda los commits cuando el usuario te pida.
- **Uso como Checkpoints**: Antes de experimentar, commit con `[CHECKPOINT-XXX] Inicio de experimento X`. Si falla, revierte con `git reset --hard <commit-hash>` o `git revert`.

### Comandos Básicos para Commits
- `git add .` o `git add <archivo>`: Agregar cambios al staging.
- `git commit -m "[TIPO] Mensaje"`: Crear commit.
- `git log --oneline`: Ver historial de commits.
- `git reset --soft <commit>`: Deshacer commit pero mantener cambios.
- `git reset --hard <commit>`: Deshacer commit y cambios (usar con cuidado).

## Sistema de Versionado

El versionado es fundamental en el desarrollo y debe estar **siempre al inicio de cada commit**. Utilizamos Conventional Commits para mantener consistencia y facilitar la automatización.

### Formato de Versionado en Commits

**IMPORTANTE**: El versionado debe aparecer **AL INICIO** de cada mensaje de commit:

```
[TIPO-NÚMERO] Descripción del cambio
```

### Tipos de Versionado

- **[FEAT-NNN]**: Nueva funcionalidad implementada
- **[FIX-NNN]**: Corrección de bugs o errores
- **[REFACTOR-NNN]**: Mejora del código sin cambiar funcionalidad
- **[DOC-NNN]**: Cambios en documentación
- **[TEST-NNN]**: Agregar o modificar tests
- **[STYLE-NNN]**: Cambios de estilo/formateo
- **[CHORE-NNN]**: Tareas de mantenimiento
- **[CHECKPOINT-NNN]**: Punto de guardado en desarrollo
- **[MERGE-NNN]**: Integración de branches

### Números de Versionado

- **Contador incremental**: Cada tipo mantiene su propio contador
- **Por feature/branch**: Reinicia contador en branches específicas
- **Archivo de referencia**: Mantén `docs/commit-counter.txt` actualizado con contadores por tipo (e.g., FEAT: 5, FIX: 2). Este archivo se actualiza manualmente después de cada commit para mantener consistencia local.
- **Ejemplos**:
  - Primera feature: `[FEAT-001]`
  - Segundo fix: `[FIX-002]`
  - Primera refactorización: `[REFACTOR-001]`

### Versionado Semántico (Semantic Versioning)

Complementamos con versionado semántico para releases:

- **MAJOR** (X.0.0): Cambios incompatibles
- **MINOR** (X.Y.0): Nuevas funcionalidades compatibles
- **PATCH** (X.Y.Z): Correcciones de bugs

### Ejemplos de Commits con Versionado

```bash
# ✅ Correcto - Versionado al inicio
[FEAT-001] Implementar sistema de autenticación JWT
[FIX-002] Corregir validación de email en registro
[REFACTOR-003] Optimizar consultas de base de datos
[DOC-004] Actualizar documentación de API REST
[TEST-005] Agregar tests unitarios para servicios

# ❌ Incorrecto - Sin versionado o mal ubicado
Implementar sistema de autenticación JWT [FEAT-001]
feat: agregar autenticación (sin formato estandarizado)
Cambios varios sin versionado
```

### Flujo de Versionado

1. **Antes de cada commit**: Verifica el último número usado en ese tipo usando uno de estos métodos:
   - **Método 1 (Recomendado - Archivo de contador)**: Revisa y actualiza `docs/commit-counter.txt`. Incrementa el contador correspondiente al tipo (e.g., si FEAT es 5, usa 6 para el próximo).
   - **Método 2 (Historial de Git)**: Ejecuta `git log --oneline --grep='\[TIPO-' | head -1` (reemplaza TIPO con el tipo, e.g., FEAT). Extrae el número del mensaje y incrementa.
2. **Prepara contador**: Si usas el archivo, calcula el nuevo número incrementado para el tipo correspondiente (e.g., si FEAT es 5, usa 6 para el próximo).
3. **Actualiza archivo contador**: Después del commit, edita `docs/commit-counter.txt` con los nuevos contadores para mantener consistencia local (no requiere commit separado).

### Herramientas de Apoyo

- **Conventional Commits**: Estándar para mensajes estructurados
- **Semantic Release**: Automatización de versionado y changelogs
- **Commitizen**: CLI para generar commits convencionales
- **Husky + Commitlint**: Validación automática de formato

### Mejores Prácticas de Versionado

- **Consistencia**: Siempre usa el mismo formato
- **Precisión**: Elige el tipo correcto para cada cambio
- **Claridad**: Descripción concisa pero descriptiva
- **Secuencial**: Números incrementales sin saltos
- **Documentado**: Mantén registro de números usados

## Sistema de Branches

Branches permiten desarrollar en paralelo sin afectar el código principal. Usa una estrategia clara para identificar procesos fácilmente.

### Estrategia Recomendada
- **main**: Código de producción estable. Solo merges probados.
- **CO-V{N}-{detalle}**: Versiones beta para desarrollo e integración de features (e.g., `CO-V1-beta`, `CO-V2-nueva-feature`).


### Flujo de Trabajo
1. Desde la branch beta activa (e.g., `CO-V1-beta`), crea una branch para la tarea: `git checkout -b feature/nueva-feature`.
2. Desarrolla y commit con frecuencia.
3. Al completar, merge a la branch beta via Pull Request (PR) en GitHub.
4. Revisa y aprueba PRs antes de merge a `main`.

### Comandos para Branches
- `git branch`: Listar branches.
- `git checkout <branch>` o `git switch <branch>`: Cambiar branch.
- `git checkout -b <nueva-branch>`: Crear y cambiar.
- `git merge <branch>`: Integrar branch (desde la actual).
- `git branch -d <branch>`: Eliminar branch local.
- `git push origin <branch>`: Subir branch a GitHub.


## Flujo Completo con Vibe Coding

1. **Setup Inicial**: Crea repo en GitHub, clona, configura `.gitignore` (ver arriba).
2. **Desarrollo**: Crea branch `feature/`, desarrolla y commit con frecuencia.
3. **Validación**: Usa los commits como checkpoints para el proceso de desarrollo dentro de cada branch.
4. **Integración**: PR a la branch beta, luego a `main` si es producción.
5. **Reversión**: Si falla, usa `git reset` o `git revert` a un checkpoint.
6. **Colaboración**: Usa Issues y PRs en GitHub para tracking.

## Comandos Útiles y Mejores Prácticas

- **Ver Cambios**: `git status`, `git diff`.
- **Resolver Conflictos**: Edita archivos, `git add`, `git commit`.
- **Push/Pull**: `git push origin <branch>`, `git pull origin <branch>`.
- **Mejores Prácticas**:
  - Commit temprano y menudo.
  - Usa branches para aislamiento.
  - Revisa PRs para calidad.
  - Documenta en commits el proceso (e.g., referencia a `proceso.md`).
  - Evita force push en branches compartidas.

## Referencias

- Consulta `instrucciones-globales.md` para reglas generales.
- Actualiza `proceso.md` con fases de desarrollo.

Siguiendo estas instrucciones, GitHub se convierte en una herramienta poderosa para versionado y checkpoints en Vibe Coding.
