import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { CustomerEntity } from './entities/customer.entity';
import { DeliveryEntity } from './entities/delivery.entity';
import { ProductEntity } from './entities/product.entity';
import { StockEntity } from './entities/stock.entity';
import { TransactionEntity } from './entities/transaction.entity';

// ============================================================
// INTERFACES
// ============================================================

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Stock {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Delivery {
  id: string;
  customerId: string;
  address: string;
  city: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export interface InternalTransaction {
  id: string;
  reference: string;
  amount: number;
  email: string;
  status: string;
  customerId?: string;
  deliveryId?: string;
  createdAt: string;
  wompiTransactionId?: string;
}

// ============================================================
// SERVICE
// ============================================================

@Injectable()
export class AppService {

  // ==========================================================
  // REPOSITORIES
  // ==========================================================

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,

    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,

    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  // ==========================================================
  // PRODUCTO
  // ==========================================================

  async getProduct(): Promise<Product> {

    let product =
      await this.productRepository.findOne({
        where: {
          id: 'PROD-001',
        },
      });

    if (!product) {

      product =
        await this.productRepository.save({
          id: 'PROD-001',
          name: 'Producto Wompi',
          price: 50000,
          stock: 10,
        });
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    };
  }

  // ==========================================================
  // STOCK
  // ==========================================================

  async getStock(): Promise<Stock[]> {

    let stock =
      await this.stockRepository.find();

    if (stock.length === 0) {

      await this.stockRepository.save({
        id: '1',
        name: 'Producto Wompi',
        quantity: 10,
        price: 50000,
      });

      stock =
        await this.stockRepository.find();
    }

    return stock.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
  }

  // ==========================================================
  // CUSTOMERS
  // ==========================================================

  async createCustomer(
    name: string,
    email: string,
    phone: string,
  ): Promise<{
    success: boolean;
    data: Customer;
  }> {

    const customer: CustomerEntity = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
    };

    const savedCustomer =
      await this.customerRepository.save(
        customer,
      );

    return {
      success: true,

      data: {
        id: savedCustomer.id,
        name: savedCustomer.name,
        email: savedCustomer.email,
        phone: savedCustomer.phone,
      },
    };
  }

  // ==========================================================
  // OBTENER CUSTOMERS
  // ==========================================================

  async getCustomers(): Promise<{
    success: boolean;
    data: Customer[];
  }> {

    const customers =
      await this.customerRepository.find();

    return {
      success: true,

      data: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      })),
    };
  }

  // ==========================================================
  // DELIVERIES
  // ==========================================================

  async createDelivery(
    customerId: string,
    address: string,
    city: string,
    notes?: string,
  ): Promise<{
    success: boolean;
    data: Delivery;
  }> {

    const delivery: DeliveryEntity = {
      id: crypto.randomUUID(),
      customerId,
      address,
      city,
      notes,
      status: 'PENDING',
      createdAt: new Date(),
    };

    const savedDelivery =
      await this.deliveryRepository.save(
        delivery,
      );

    return {
      success: true,

      data: {
        id: savedDelivery.id,
        customerId: savedDelivery.customerId,
        address: savedDelivery.address,
        city: savedDelivery.city,
        notes: savedDelivery.notes,
        status: savedDelivery.status,
        createdAt:
          savedDelivery.createdAt.toISOString(),
      },
    };
  }

  // ==========================================================
  // OBTENER DELIVERIES
  // ==========================================================

  async getDeliveries(): Promise<{
    success: boolean;
    data: Delivery[];
  }> {

    const deliveries =
      await this.deliveryRepository.find();

    return {
      success: true,

      data: deliveries.map((delivery) => ({
        id: delivery.id,
        customerId: delivery.customerId,
        address: delivery.address,
        city: delivery.city,
        notes: delivery.notes,
        status: delivery.status,
        createdAt:
          delivery.createdAt.toISOString(),
      })),
    };
  }

  // ==========================================================
  // CREAR TRANSACCIÓN INTERNA PENDING
  // ==========================================================

  private async createInternalTransaction(
    amount: number,
    email: string,
    customerId?: string,
    deliveryId?: string,
  ): Promise<TransactionEntity> {

    const transactionNumber =
      `TXN-${Date.now()}-${Math.floor(
        Math.random() * 100000,
      )}`;

    const reference =
      `PAY-${Date.now()}-${Math.floor(
        Math.random() * 100000,
      )}`;

    const transaction: TransactionEntity = {
      id: transactionNumber,
      reference,
      amount,
      email,
      status: 'PENDING',
      customerId,
      deliveryId,
      createdAt: new Date(),
    };

    const savedTransaction =
      await this.transactionRepository.save(
        transaction,
      );

    console.log(
      '============================================',
    );

    console.log(
      'TRANSACCIÓN INTERNA CREADA EN POSTGRESQL:',
    );

    console.log(
      savedTransaction,
    );

    console.log(
      '============================================',
    );

    return savedTransaction;
  }

  // ==========================================================
  // DESCONTAR STOCK
  // ==========================================================

  private async decreaseStock(): Promise<void> {

    const stock =
      await this.stockRepository.findOne({
        where: {
          id: '1',
        },
      });

    if (!stock) {

      throw new Error(
        'No existe el producto en stock',
      );
    }

    if (stock.quantity <= 0) {

      throw new Error(
        'Stock insuficiente',
      );
    }

    stock.quantity -= 1;

    const updatedStock =
      await this.stockRepository.save(
        stock,
      );

    console.log(
      '============================================',
    );

    console.log(
      'STOCK ACTUALIZADO EN POSTGRESQL:',
    );

    console.log(
      updatedStock,
    );

    console.log(
      '============================================',
    );
  }

  // ==========================================================
  // PAGOS WOMPI
  // ==========================================================

  async createPayment(
    amount: string,
    email: string,
    token: string,
    installments: number,
    customerId?: string,
    deliveryId?: string,
  ) {

    const amountInCents =
      Number(amount) * 100;

    // ========================================================
    // VALIDAR MONTO
    // ========================================================

    if (
      !Number.isFinite(amountInCents) ||
      amountInCents <= 0
    ) {

      throw new Error(
        'El monto del pago no es válido',
      );
    }

    // ========================================================
    // 1. CREAR TRANSACCIÓN INTERNA PENDING
    // ========================================================

    const internalTransaction =
      await this.createInternalTransaction(
        amountInCents,
        email,
        customerId,
        deliveryId,
      );

    console.log(
      'TRANSACTION NUMBER:',
      internalTransaction.id,
    );

    console.log(
      'STATUS INICIAL:',
      internalTransaction.status,
    );

    // ========================================================
    // 2. OBTENER TOKENS DE WOMPI
    // ========================================================

    const merchantResponse =
      await fetch(
        `${process.env.WOMPI_API_URL}/merchants/${process.env.WOMPI_PUBLIC_KEY}`,
      );

    const merchantData =
      await merchantResponse.json();

    console.log(
      'STATUS MERCHANT:',
      merchantResponse.status,
    );

    console.log(
      'RESPUESTA MERCHANT:',
    );

    console.dir(
      merchantData,
      {
        depth: null,
      },
    );

    if (!merchantResponse.ok) {

      internalTransaction.status =
        'ERROR';

      await this.transactionRepository.save(
        internalTransaction,
      );

      throw new Error(
        'No se pudo obtener la información de Wompi',
      );
    }

    // ========================================================
    // ACCEPTANCE TOKEN
    // ========================================================

    const acceptanceToken =
      merchantData
        ?.data
        ?.presigned_acceptance
        ?.acceptance_token;

    // ========================================================
    // PERSONAL DATA AUTH TOKEN
    // ========================================================

    const personalAuthToken =
      merchantData
        ?.data
        ?.presigned_personal_data_auth
        ?.acceptance_token;

    if (!acceptanceToken) {

      internalTransaction.status =
        'ERROR';

      await this.transactionRepository.save(
        internalTransaction,
      );

      throw new Error(
        'Wompi no devolvió acceptance_token',
      );
    }

    if (!personalAuthToken) {

      internalTransaction.status =
        'ERROR';

      await this.transactionRepository.save(
        internalTransaction,
      );

      throw new Error(
        'Wompi no devolvió accept_personal_auth',
      );
    }

    // ========================================================
    // 3. GENERAR FIRMA DE INTEGRIDAD
    // ========================================================

    const integritySecret =
      process.env.WOMPI_INTEGRITY_SECRET;

    if (!integritySecret) {

      internalTransaction.status =
        'ERROR';

      await this.transactionRepository.save(
        internalTransaction,
      );

      throw new Error(
        'Falta WOMPI_INTEGRITY_SECRET en el archivo .env',
      );
    }

    const reference =
      internalTransaction.reference;

    const signatureText =
      `${reference}${amountInCents}COP${integritySecret}`;

    const signature =
      crypto
        .createHash('sha256')
        .update(signatureText)
        .digest('hex');

    console.log(
      'REFERENCE:',
      reference,
    );

    console.log(
      'AMOUNT IN CENTS:',
      amountInCents,
    );

    console.log(
      'SIGNATURE:',
      signature,
    );

    // ========================================================
    // 4. LLAMAR A WOMPI
    // ========================================================

    const response =
      await fetch(
        `${process.env.WOMPI_API_URL}/transactions`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
          },

          body: JSON.stringify({

            acceptance_token:
              acceptanceToken,

            accept_personal_auth:
              personalAuthToken,

            amount_in_cents:
              amountInCents,

            currency:
              'COP',

            customer_email:
              email,

            reference,

            signature,

            payment_method: {
              type: 'CARD',

              token,

              installments,
            },
          }),
        },
      );

    const data =
      await response.json();

    // ========================================================
    // LOG WOMPI
    // ========================================================

    console.log(
      'STATUS WOMPI:',
      response.status,
    );

    console.log(
      'RESPUESTA WOMPI:',
    );

    console.dir(
      data,
      {
        depth: null,
      },
    );

    // ========================================================
    // ERROR WOMPI
    // ========================================================

    if (!response.ok) {

      internalTransaction.status =
        'DECLINED';

      await this.transactionRepository.save(
        internalTransaction,
      );

      throw new Error(
        data?.error?.messages
          ? JSON.stringify(
              data.error.messages,
            )
          : data?.error?.reason ||
              data?.error?.message ||
              'Error al crear el pago',
      );
    }

    // ========================================================
    // 5. OBTENER DATOS DE WOMPI
    // ========================================================

    const wompiTransactionId =
      data?.data?.id;

    const wompiStatus =
      data?.data?.status;

    // ========================================================
    // 6. GUARDAR ID DE WOMPI
    // ========================================================

    internalTransaction.wompiTransactionId =
      wompiTransactionId;

    // ========================================================
    // 7. ACTUALIZAR ESTADO INTERNO
    // ========================================================

    if (wompiStatus) {

      internalTransaction.status =
        wompiStatus;

    } else {

      internalTransaction.status =
        'PENDING';
    }

    // ========================================================
    // GUARDAR TRANSACCIÓN EN POSTGRESQL
    // ========================================================

    await this.transactionRepository.save(
      internalTransaction,
    );

    console.log(
      '============================================',
    );

    console.log(
      'TRANSACCIÓN ACTUALIZADA EN POSTGRESQL:',
    );

    console.log(
      internalTransaction,
    );

    console.log(
      '============================================',
    );

    // ========================================================
    // 8. DESCONTAR STOCK SI EL PAGO FUE APROBADO
    // ========================================================

    if (wompiStatus === 'APPROVED') {

      await this.decreaseStock();
    }

    // ========================================================
    // 9. RESPUESTA AL FRONTEND
    // ========================================================

    return {

      success: true,

      data:
        data?.data,

      internalTransaction: {

        id:
          internalTransaction.id,

        reference:
          internalTransaction.reference,

        status:
          internalTransaction.status,

        amount:
          internalTransaction.amount,

        email:
          internalTransaction.email,

        wompiTransactionId:
          internalTransaction.wompiTransactionId,
      },
    };
  }

  // ==========================================================
  // CONSULTAR ESTADO DEL PAGO
  // ==========================================================

  async getPaymentStatus(
    transactionId: string,
  ) {

    // ========================================================
    // 1. BUSCAR TRANSACCIÓN INTERNA
    // ========================================================

    const internalTransaction =
      await this.transactionRepository.findOne({
        where: [
          {
            id: transactionId,
          },
          {
            wompiTransactionId:
              transactionId,
          },
        ],
      });

    // ========================================================
    // 2. OBTENER ID DE WOMPI
    // ========================================================

    const wompiId =
      internalTransaction?.wompiTransactionId ||
      transactionId;

    // ========================================================
    // 3. CONSULTAR WOMPI
    // ========================================================

    const response =
      await fetch(
        `${process.env.WOMPI_API_URL}/transactions/${wompiId}`,
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${process.env.WOMPI_PUBLIC_KEY}`,

            'Content-Type':
              'application/json',
          },
        },
      );

    const data =
      await response.json();

    console.log(
      '============================================',
    );

    console.log(
      'CONSULTANDO ESTADO DEL PAGO',
    );

    console.log(
      'WOMPI TRANSACTION ID:',
      wompiId,
    );

    console.log(
      'STATUS HTTP:',
      response.status,
    );

    console.log(
      'RESPUESTA WOMPI:',
    );

    console.dir(
      data,
      {
        depth: null,
      },
    );

    console.log(
      '============================================',
    );

    // ========================================================
    // 4. VALIDAR RESPUESTA
    // ========================================================

    if (!response.ok) {

      throw new Error(
        data?.error?.messages
          ? JSON.stringify(
              data.error.messages,
            )
          : data?.error?.reason ||
              data?.error?.message ||
              'Error al consultar el estado del pago',
      );
    }

    // ========================================================
    // 5. OBTENER ESTADO WOMPI
    // ========================================================

    const wompiStatus =
      data?.data?.status;

    console.log(
      'ESTADO WOMPI:',
      wompiStatus,
    );

    // ========================================================
    // 6. PAGO APROBADO
    // ========================================================

    if (
      internalTransaction &&
      wompiStatus === 'APPROVED'
    ) {

      // ------------------------------------------------------
      // VERIFICAR SI YA SE HABÍA DESCONTADO
      // ------------------------------------------------------

      const wasAlreadyApproved =
        internalTransaction.status === 'APPROVED';

      // ------------------------------------------------------
      // ACTUALIZAR ESTADO
      // ------------------------------------------------------

      internalTransaction.status =
        'APPROVED';

      await this.transactionRepository.save(
        internalTransaction,
      );

      console.log(
        'ESTADO INTERNO ACTUALIZADO: APPROVED',
      );

      // ------------------------------------------------------
      // DESCONTAR SOLO UNA VEZ
      // ------------------------------------------------------

      if (!wasAlreadyApproved) {

        console.log(
          '============================================',
        );

        console.log(
          'PAGO APROBADO - DESCONTANDO STOCK',
        );

        await this.decreaseStock();

        console.log(
          'STOCK DESCONTADO CORRECTAMENTE',
        );

        console.log(
          '============================================',
        );

      } else {

        console.log(
          'STOCK YA HABÍA SIDO DESCONTADO PARA ESTA TRANSACCIÓN',
        );
      }

    } else if (
      internalTransaction &&
      wompiStatus
    ) {

      // ======================================================
      // ACTUALIZAR OTROS ESTADOS
      // ======================================================

      internalTransaction.status =
        wompiStatus;

      await this.transactionRepository.save(
        internalTransaction,
      );

      console.log(
        'ESTADO INTERNO ACTUALIZADO:',
        wompiStatus,
      );
    }

    // ========================================================
    // 7. RESPUESTA
    // ========================================================

    return {

      success: true,

      data:
        data?.data,

      internalTransaction:
        internalTransaction || null,
    };
  }

  // ==========================================================
  // TRANSACTIONS
  // ==========================================================

  async getTransactions(): Promise<{
    success: boolean;
    data: TransactionEntity[];
  }> {

    const transactions =
      await this.transactionRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });

    return {

      success: true,

      data:
        transactions,
    };
  }
}