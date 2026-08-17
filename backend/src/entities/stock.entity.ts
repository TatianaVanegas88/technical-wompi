import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('stock')
export class StockEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  name!: string;

  @Column('integer', { nullable: true })
  quantity!: number;

  @Column('integer', { nullable: true })
  price!: number;
}