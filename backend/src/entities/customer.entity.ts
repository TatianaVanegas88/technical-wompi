import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;
}