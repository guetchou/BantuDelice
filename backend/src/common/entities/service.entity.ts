import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Review } from './review.entity';
import { User } from './user.entity';

export enum ServiceCategory {
  FOOD_DELIVERY = 'FOOD_DELIVERY',
  TRANSPORT = 'TRANSPORT',
  PACKAGE_DELIVERY = 'PACKAGE_DELIVERY',
  CAR_RENTAL = 'CAR_RENTAL',
  HOME_SERVICES = 'HOME_SERVICES',
  ENTERTAINMENT = 'ENTERTAINMENT',
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ServiceCategory,
  })
  category: ServiceCategory;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => OrderItem, (orderItem) => orderItem.service)
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];

  @ManyToMany(() => User, (user) => user.favorites)
  favorites: User[];
} 