import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CustomerEntity } from './entities/customer.entity';
import { DeliveryEntity } from './entities/delivery.entity';
import { ProductEntity } from './entities/product.entity';
import { StockEntity } from './entities/stock.entity';
import { TransactionEntity } from './entities/transaction.entity';

@Module({
  imports: [
    // ============================================================
    // VARIABLES DE ENTORNO
    // ============================================================
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ============================================================
    // CONEXIÓN A POSTGRESQL
    // ============================================================
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      autoLoadEntities: true,

      synchronize: true,
    }),

    // ============================================================
    // REPOSITORIOS / ENTIDADES
    // ============================================================
    TypeOrmModule.forFeature([
      CustomerEntity,
      DeliveryEntity,
      ProductEntity,
      StockEntity,
      TransactionEntity,
    ]),
  ],

  controllers: [
    AppController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule {}