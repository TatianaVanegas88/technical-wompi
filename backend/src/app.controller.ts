import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
  ) {}

  // ============================================================
  // PRODUCTO / STOCK
  // ============================================================

  @Get('stock')
  getStock() {
    return this.appService.getStock();
  }

  // ============================================================
  // PRODUCTO
  // ============================================================

  @Get('product')
  getProduct() {
    return this.appService.getProduct();
  }

  // ============================================================
  // CUSTOMERS
  // ============================================================

  @Post('customers')
  createCustomer(
    @Body()
    body: {
      name: string;
      email: string;
      phone: string;
    },
  ) {
    return this.appService.createCustomer(
      body.name,
      body.email,
      body.phone,
    );
  }

  @Get('customers')
  getCustomers() {
    return this.appService.getCustomers();
  }

  // ============================================================
  // DELIVERIES
  // ============================================================

  @Post('deliveries')
  createDelivery(
    @Body()
    body: {
      customerId: string;
      address: string;
      city: string;
      notes?: string;
    },
  ) {
    return this.appService.createDelivery(
      body.customerId,
      body.address,
      body.city,
      body.notes,
    );
  }

  @Get('deliveries')
  getDeliveries() {
    return this.appService.getDeliveries();
  }

  // ============================================================
  // PAGOS
  // ============================================================

  @Post('payments')
  async createPayment(
    @Body()
    body: {
      amount: string;
      email: string;
      token: string;
      installments: number;
      customerId?: string;
      deliveryId?: string;
    },
  ) {
    return this.appService.createPayment(
      body.amount,
      body.email,
      body.token,
      body.installments,
      body.customerId,
      body.deliveryId,
    );
  }

  // ============================================================
  // CONSULTAR ESTADO DEL PAGO
  // ============================================================

  @Get('payments/:id')
  async getPaymentStatus(
    @Param('id') id: string,
  ) {
    return this.appService.getPaymentStatus(id);
  }

  // ============================================================
  // TRANSACTIONS
  // ============================================================

  @Get('transactions')
  getTransactions() {
    return this.appService.getTransactions();
  }
}