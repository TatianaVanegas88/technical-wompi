# Technical Wompi

Aplicación web ara integrar un proceso de compra y pago utilizando Wompi.

La aplicación permite consultar un producto y su inventario, registrar los datos del cliente y la entrega, iniciar un proceso de pago, consultar el estado de la transacción y actualizar el inventario cuando el pago es aprobado.

El proyecto está dividido en un frontend y un backend.

## Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- React Redux
- Redux Toolkit
- HTML
- CSS
- Fetch API

### Backend

- Node.js
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Wompi API

## Funcionalidades

### Frontend

- Visualización del producto disponible.
- Consulta del precio y stock.
- Registro de los datos del cliente.
- Registro de la información de entrega.
- Inicio del proceso de pago.
- Ingreso de los datos necesarios para realizar el pago.
- Selección del número de cuotas.
- Visualización del resultado de la transacción.
- Consulta del estado del pago.
- Visualización de la información de la transacción realizada.

### Backend

- Gestión de productos.
- Gestión del inventario.
- Registro de clientes.
- Registro de entregas.
- Creación de transacciones internas.
- Integración con la API de Wompi.
- Generación de la firma de integridad requerida por Wompi.
- Creación de pagos.
- Consulta del estado de las transacciones.
- Actualización del estado de las transacciones.
- Descuento del inventario cuando un pago es aprobado.
- Almacenamiento de las transacciones en PostgreSQL.

## ## Ejecución del proyecto

1. **Backend: ingresar a la carpeta `backend` con `cd backend`,
   instalar las dependencias con `npm install`
   configurar el archivo `.env` tomando como referencia `.env.example` 
   ejecutar el servidor con `npm run start:dev`. El backend estará disponible en `http://localhost:3000`.

3. **Frontend: abrir una segunda terminal,
ingresar a la carpeta `frontend` con `cd frontend`
instalar las dependencias con `npm install` 
ejecutar la aplicación con `npm run dev`. 
Acceder a la URL indicada por Vite en la terminal, normalmente `http://localhost:5173`.

4. **Importante: mantener ambas terminales abiertas para que el backend y el frontend funcionen correctamente.


## Estructura del proyecto

```text
technical-wompi/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── features/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── store.ts
│   ├── .env
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── entities/
│   │   │   ├── customer.entity.ts
│   │   │   ├── delivery.entity.ts
│   │   │   ├── product.entity.ts
│   │   │   ├── stock.entity.ts
│   │   │   └── transaction.entity.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── test/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
