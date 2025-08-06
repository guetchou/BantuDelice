import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Service } from './service.entity';
import { MenuItem } from './menu-item.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column({ nullable: true })
  serviceId: string;

  @Column({ nullable: true })
  menuItemId: string;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Service, (service) => service.orderItems)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.orderItems)
  @JoinColumn({ name: 'menuItemId' })
  menuItem: MenuItem;
} 