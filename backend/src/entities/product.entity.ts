import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  name!: string;

  @Column('integer', { nullable: true })
  price!: number;

  @Column('integer', { nullable: true })
  stock!: number;
}