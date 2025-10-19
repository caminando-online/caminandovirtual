# Registro de Puertos para Desarrollo

Este documento registra el uso correcto de puertos en el proyecto para evitar interferencias durante el desarrollo. Cada aplicación que requiera un puerto debe tener uno asignado de manera organizada. Antes de asignar o usar un puerto, verifica que no esté en uso en el sistema (e.g., usando `netstat` o herramientas similares).

## 🚀 Puertos Activos

| Puerto | Servicio | Ubicación | Estado | Descripción |
|--------|----------|-----------|--------|-------------|
| 3000 | Frontend Producción | `src/frontend/` | ✅ Activo | Interfaz de usuario principal (React/Next.js) |
| 5000 | API Server | `src/backend/api-server/` | ✅ Activo | APIs para frontend (datos procesados) |
| 8000 | Script Server | `src/backend/script-server/` | ✅ Activo | Servidor para scripts y batch jobs |

*Nota: Reemplaza X, Y, Z con números asignados por la IA al configurar el proyecto (e.g., X=3 para 3000, Y=5 para 5000). Actualiza esta tabla a medida que se agreguen nuevos servicios.*

## 📝 Notas de Uso

- **Puerto X000**: Frontend de producción (principal y fijo, e.g., 3000 para Next.js).
- **Puerto Y000**: Backend de producción (principal y fijo, e.g., 5000 para API Express.js).

### Reglas Generales
- **Asignación**: La IA asignará números específicos a X, Y, Z al crear la estructura del proyecto, basándose en disponibilidad.
- **Verificación**: Antes de usar un puerto, ejecuta `netstat -ano | findstr :PUERTO` (en Windows) para confirmar que no esté ocupado.
- **Debugging**: Si necesitas un puerto alternativo para solucionar errores, usa uno en el rango Z000-Z200. Una vez resuelto, libera el puerto de debugging y regresa al asignado.
- **Actualización**: Mantén esta tabla actualizada con cada nuevo servicio o cambio. Registra en `proceso.md` cualquier modificación.
- **Conflictos**: Si hay un conflicto, elige un puerto libre dentro del rango correspondiente y documenta el cambio.

Este sistema asegura un desarrollo ordenado y sin interferencias. Consulta este archivo antes de iniciar cualquier servidor o servicio.
