# Caminando Online - Plataforma de Comparación de Precios

Plataforma web para comparar precios de productos entre diferentes supermercados argentinos (Carrefour, Dia, Jumbo, Vea, Disco).

## 🏗️ Arquitectura del Proyecto

### Frontend
- **Framework**: React 19 con TypeScript
- **Estilos**: Sass/SCSS con arquitectura modular
- **Estado**: Gestión local con servicios modulares
- **Responsive**: Diseño mobile-first

### Backend
- **Framework**: Node.js 18 + Express
- **Base de Datos**: MongoDB Atlas con arquitectura multi-database (8 bases separadas)
- **Seguridad**: Helmet, CORS, Rate Limiting, JWT
- **Despliegue**: Docker + AWS ECS Fargate

### Infraestructura
- **Contenedorización**: Docker con multi-stage builds
- **Orquestación**: AWS ECS con Fargate (serverless)
- **Load Balancing**: Application Load Balancer
- **Escalado**: Auto-scaling basado en CPU y requests
- **Monitoreo**: CloudWatch con health checks

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- Docker
- AWS CLI configurado
- Cuenta AWS con permisos para ECS, ECR, ELB

### Instalación y Desarrollo Local

1. **Clonar repositorio:**
   ```bash
   git clone <repository-url>
   cd caminando-online
   ```

2. **Configurar Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con tus credenciales de MongoDB Atlas
   npm run dev
   ```

3. **Configurar Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Desarrollo con Docker (opcional):**
   ```bash
   cd backend
   docker-compose up -d
   ```

## 🐳 Despliegue en Producción

### Despliegue Automático a AWS ECS

1. **Configurar AWS CLI:**
   ```bash
   aws configure
   # Región recomendada: us-east-1
   ```

2. **Configurar Variables de Entorno Seguras:**
   ```bash
   cd backend
   chmod +x setup-ecs-env.sh
   ./setup-ecs-env.sh
   ```

3. **Desplegar a ECS:**
   ```bash
   chmod +x deploy-ecs.sh
   ./deploy-ecs.sh
   ```

### Arquitectura de Despliegue

- **ECS Cluster**: Grupo de contenedores serverless
- **Fargate**: Computo sin servidores para contenedores
- **Application Load Balancer**: Distribución de tráfico con health checks
- **ECR**: Registro privado de contenedores
- **Parameter Store**: Variables de entorno encriptadas
- **Auto-scaling**: Escalado automático basado en métricas

### Costos Aproximados
- **Desarrollo**: $5-15/mes
- **Producción (miles de usuarios)**: $50-200/mes con auto-scaling

## 📊 Características

### Frontend
- ✅ Selección de supermercados con interfaz intuitiva
- ✅ Diseño responsive y moderno
- ✅ Arquitectura modular por componentes
- 🔄 Próximas: Categorías, productos, carrito de compras

### Backend
- ✅ API RESTful con Express
- ✅ Arquitectura multi-database MongoDB
- ✅ Health checks y monitoreo
- ✅ Seguridad avanzada (Helmet, CORS, Rate Limiting)
- ✅ Conexiones optimizadas a MongoDB Atlas

### Base de Datos
- ✅ 8 bases de datos separadas para rendimiento óptimo
- ✅ Esquemas Mongoose validados
- ✅ Conexiones independientes por dominio
- 🔄 Próximas: Migración de datos crudos a procesados

## 🗄️ Arquitectura de Base de Datos

### Bases de Datos Separadas
- **`admin`**: Usuarios, sesiones, carritos, direcciones
- **`operations_db`**: Pedidos, historial de precios, logs, configuraciones
- **`caminando-online`**: Datos normalizados para frontend
- **`carrefour_raw`**: Datos crudos extraídos de Carrefour
- **`dia_raw`**: Datos crudos extraídos de Dia
- **`jumbo_raw`**: Datos crudos extraídos de Jumbo
- **`vea_raw`**: Datos crudos extraídos de Vea
- **`disco_raw`**: Datos crudos extraídos de Disco

## 🔒 Seguridad

- **Backend**: Headers de seguridad, rate limiting, validación de inputs
- **Base de Datos**: Conexiones seguras, encriptación en tránsito
- **Infraestructura**: VPC, Security Groups, IAM roles con mínimo privilegio
- **Variables**: Almacenadas de forma segura en AWS Parameter Store

## 📈 Monitoreo y Escalado

### Health Checks
- Endpoint `/health` para verificación de estado
- Monitoreo de conectividad con todas las bases de datos
- Load Balancer remueve automáticamente instancias unhealthy

### Escalado Automático
- **CPU > 70%**: Escala hacia arriba
- **Requests > 1000/min**: Escala hacia arriba
- **Mínimo**: 1 instancia (desarrollo)
- **Máximo**: 10 instancias (configurable)

### Logs y Métricas
```bash
# Ver logs en tiempo real
aws logs tail /ecs/caminando-online-backend --follow --region us-east-1

# Ver métricas en CloudWatch
aws cloudwatch describe-alarms --alarm-name-prefix "ECS-"
```

## 🛠️ Desarrollo

### Estructura del Proyecto
```
caminando-online/
├── frontend/           # React + TypeScript
│   ├── src/
│   │   ├── pages/Home/
│   │   │   ├── scripts/selectSupermarket.ts
│   │   │   └── styles/selectSupermarket.scss
│   │   └── services/api.ts
│   └── package.json
├── backend/            # Node.js + Express
│   ├── src/
│   │   ├── config/database.js
│   │   ├── routes/api.js
│   │   ├── controllers/
│   │   └── models/
│   ├── Dockerfile
│   ├── deploy-ecs.sh
│   └── setup-ecs-env.sh
├── docs/               # Documentación
└── README.md
```

### Scripts de Desarrollo
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start

# Docker local
cd backend && docker-compose up -d

# Despliegue producción
cd backend && ./deploy-ecs.sh
```

## 🔄 Próximos Pasos

### Corto Plazo
- [ ] Completar flujo de selección de categorías
- [ ] Implementar búsqueda y filtrado de productos
- [ ] Agregar funcionalidad de carrito de compras
- [ ] Implementar sistema de usuarios y autenticación

### Largo Plazo
- [ ] Sistema de scraping automatizado
- [ ] Notificaciones de cambios de precio
- [ ] Comparación histórica de precios
- [ ] Integración con delivery services
- [ ] App móvil nativa

## 🤝 Contribución

1. Seguir las instrucciones en `.github/instructions/`
2. Mantener arquitectura modular
3. Implementar tests para nuevas funcionalidades
4. Actualizar documentación
5. Seguir convenciones de seguridad

## 📄 Licencia

MIT License - Ver LICENSE para más detalles.

---

**Versión**: 1.0.0
**Última actualización**: Octubre 2024
**Estado**: Desarrollo Activo 🚀