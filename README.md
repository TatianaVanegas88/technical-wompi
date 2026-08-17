# Technical Wompi

Aplicación web para realizar pagos mediante Wompi, gestionar productos, clientes, entregas, inventario y consultar el estado de las transacciones.

El proyecto está dividido en un frontend y un backend.

## Tecnologías utilizadas

### Frontend

- React
- TypeScript
- HTML
- CSS
- Fetch API

El frontend permite:

- Visualizar el producto disponible.
- Consultar el precio y stock.
- Registrar los datos del cliente.
- Registrar la información de entrega.
- Iniciar el proceso de pago.
- Ingresar los datos necesarios para realizar el pago.
- Mostrar el resultado de la transacción.
- Consultar el estado del pago.
- Mostrar la información de la transacción realizada.

### Backend

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Wompi API
- Node.js

El backend se encarga de:

- Gestionar productos.
- Gestionar inventario.
- Registrar clientes.
- Registrar entregas.
- Crear transacciones internas.
- Comunicarse con la API de Wompi.
- Generar la firma de integridad requerida por Wompi.
- Crear pagos.
- Consultar el estado de las transacciones.
- Actualizar el estado de las transacciones.
- Descontar el inventario cuando un pago es aprobado.
- Almacenar la información de las transacciones en PostgreSQL.

## Estructura del proyecto

```text
technical_wompi/
│
├── frontend/
│
└── backend/
    ├── src/
    │   ├── entities/
    │   │   ├── customer.entity.ts
    │   │   ├── delivery.entity.ts
    │   │   ├── product.entity.ts
    │   │   ├── stock.entity.ts
    │   │   └── transaction.entity.ts
    │   │
    │   ├── app.controller.ts
    │   ├── app.module.ts
    │   ├── app.service.ts
    │   └── main.ts
    │
    ├── .env
    ├── package.json
    └── tsconfig.json
