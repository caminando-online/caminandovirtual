# Caminando Online Backend

Backend API para la plataforma de comparación de precios Caminando Online, construido con Node.js, Express y MongoDB Atlas.

## 🚀 Características

- **Arquitectura Multi-Database**: 8 bases de datos separadas para optimización de rendimiento
- **Seguridad Avanzada**: Helmet, CORS, Rate Limiting, JWT
- **Conexión MongoDB Atlas**: Configuración automática desde variables de entorno
- **API RESTful**: Endpoints estructurados para frontend
- **Health Checks**: Monitoreo de estado de bases de datos
- **Manejo de Errores**: Respuestas consistentes y logging

## 📁 Estructura del Proyecto

```
backend/
├── server.js              # Punto de entrada
├── package.json           # Dependencias y scripts
├── .env                   # Variables de entorno
├── Dockerfile             # Configuración Docker
├── docker-compose.yml     # Orquestación local
├── deploy-ecs.sh          # Script despliegue ECS
├── setup-ecs-env.sh       # Setup variables entorno
└── src/
    ├── app.js             # Configuración Express
    ├── config/
    │   └── database.js    # Conexiones MongoDB
    ├── routes/
    │   ├── health.js      # Health check routes
    │   └── api.js         # API routes
    ├── controllers/
    │   ├── healthController.js
    │   └── supermarketController.js
    └── models/
        └── Supermarket.js  # Modelos Mongoose
```

## 🛠️ Instalación Local

1. **Instalar dependencias:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**
   - Copiar `.env.example` a `.env`
   - Completar con tus credenciales de MongoDB Atlas

3. **Iniciar el servidor:**
   ```bash
   npm start
   # o para desarrollo
   npm run dev
   ```

## 🐳 Desarrollo con Docker

### Ejecutar localmente con Docker
```bash
# Construir imagen
docker build -t caminando-online-backend .

# Ejecutar contenedor
docker run -p 8080:8080 --env-file .env caminando-online-backend
```

### Usar Docker Compose
```bash
docker-compose up -d
```

## � Despliegue en AWS ECS con Docker

### Prerrequisitos
- AWS CLI instalado y configurado
- Docker instalado
- Cuenta AWS con permisos para ECS, ECR, ELB, IAM

### Configuración Inicial

#### 1. Configurar AWS CLI
```bash
aws configure
# Ingresa tu Access Key, Secret Key, región (us-east-1) y formato de output (json)
```

#### 2. Configurar Variables de Entorno Seguras
```bash
chmod +x setup-ecs-env.sh
./setup-ecs-env.sh
```
Esto almacena tus variables de entorno de forma segura en AWS Parameter Store.

#### 3. Desplegar a ECS
```bash
chmod +x deploy-ecs.sh
./deploy-ecs.sh
```

### Arquitectura ECS

- **ECS Cluster**: Grupo de instancias para ejecutar contenedores
- **Fargate**: Computo serverless para contenedores
- **Application Load Balancer**: Distribuye tráfico entre contenedores
- **ECR**: Registro de contenedores privado
- **Parameter Store**: Almacenamiento seguro de variables de entorno

### Escalado Automático

ECS está configurado para escalar automáticamente basado en:
- **CPU Utilization**: >70% → escala hacia arriba
- **Request Count**: >1000 requests/minute → escala hacia arriba
- **Mínimo**: 1 instancia (para desarrollo)
- **Máximo**: 10 instancias (configurable)

## 🌐 Endpoints de la API

### Health Check
- `GET /health` - Estado general del sistema
- `GET /health/detailed` - Información detallada del sistema

### API Endpoints
- `GET /api` - Información de la API
- `GET /api/health` - Health check vía API
- `GET /api/supermarkets` - Lista de supermercados
- `GET /api/supermarkets/:id` - Detalles de un supermercado

## 📊 Monitoreo

#### Health Checks
- Endpoint: `GET /health`
- Verifica conectividad con todas las bases de datos
- Load Balancer remueve instancias unhealthy automáticamente

#### Logs
```bash
# Ver logs en tiempo real
aws logs tail /ecs/caminando-online-backend --follow --region us-east-1

# Ver logs del servicio
aws ecs describe-services --cluster caminando-online-backend-cluster --services caminando-online-backend-service
```

#### Métricas en CloudWatch
- CPU/Memory utilization
- Request count y latency
- Database connections
- Error rates

## 🔄 Actualizaciones

#### Despliegue de Nuevas Versiones
```bash
# Construir nueva imagen
docker build -t caminando-online-backend .

# Ejecutar despliegue
./deploy-ecs.sh
```

#### Actualizar Variables de Entorno
```bash
# Modificar .env localmente
# Luego ejecutar setup
./setup-ecs-env.sh

# Forzar actualización del servicio
aws ecs update-service --cluster caminando-online-backend-cluster --service caminando-online-backend-service --force-new-deployment
```

## 💰 Costos Aproximados

- **ECR**: ~$0.10 por GB almacenado
- **ECS Fargate**: ~$0.04 por vCPU/hora + $0.004 por GB/hora
- **ALB**: ~$0.0225 por hora + $0.008 por LCU/hora
- **Parameter Store**: Gratuito para primeros 10,000 parámetros
- **CloudWatch**: ~$0.50 por GB de logs

**Estimación mensual para desarrollo**: $5-15
**Estimación mensual para producción (miles de usuarios)**: $50-200 (con auto-scaling)

## 🔒 Seguridad

- **Variables de entorno**: Almacenadas en Parameter Store con encriptación
- **IAM Roles**: Principio de mínimo privilegio
- **VPC**: Aislamiento de red
- **Security Groups**: Control de tráfico
- **HTTPS**: Obligatorio en producción (configurar en ALB)

## 🔧 Troubleshooting

#### Problemas Comunes

**Contenedor no inicia:**
```bash
# Ver logs del contenedor
aws logs tail /ecs/caminando-online-backend --follow

# Ver estado del servicio
aws ecs describe-services --cluster caminando-online-backend-cluster --services caminando-online-backend-service
```

**Health check falla:**
- Verificar que `/health` endpoint responda correctamente
- Revisar conectividad con MongoDB Atlas
- Verificar variables de entorno

**Escalado no funciona:**
```bash
# Ver políticas de auto-scaling
aws application-autoscaling describe-scaling-policies --service-namespace ecs

# Ver alarmas de CloudWatch
aws cloudwatch describe-alarms --alarm-name-prefix "ECS-"
```

## 🗄️ Arquitectura de Base de Datos

### Bases de Datos
- **admin**: Usuarios, sesiones, carritos, direcciones
- **operations_db**: Pedidos, historial de precios, logs, configuraciones
- **caminando-online**: Datos normalizados para frontend
- **carrefour_raw, dia_raw, jumbo_raw, vea_raw, disco_raw**: Datos crudos de scraping

### Conexiones
- Cada base de datos tiene su propia conexión Mongoose
- Conexiones configuradas para alta disponibilidad
- Health checks automáticos

## 🔧 Desarrollo

### Scripts Disponibles
- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar con nodemon para desarrollo
- `npm test` - Ejecutar tests
- `npm run lint` - Verificar código con ESLint

### Variables de Entorno
```env
PORT=8080
NODE_ENV=production
MONGO_ADMIN_URI=mongodb+srv://...
MONGO_OPERATIONS_URI=mongodb+srv://...
MONGO_CAMINANDO_URI=mongodb+srv://...
JWT_SECRET=tu-jwt-secret-super-seguro
CORS_ORIGIN=https://tu-frontend.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

## � Próximos Pasos para Producción

1. **Configurar dominio personalizado y SSL**
2. **Implementar CDN (CloudFront)**
3. **Configurar WAF (Web Application Firewall)**
4. **Implementar backup automático de base de datos**
5. **Configurar monitoring avanzado (DataDog, New Relic)**
6. **Implementar CI/CD pipeline (CodePipeline, CodeBuild)**

## 📄 Licencia

MIT License - Ver LICENSE para más detalles.

---

**Versión**: 1.0.0
**Última actualización**: Octubre 2024