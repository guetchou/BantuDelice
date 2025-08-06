import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { Service } from './service.entity';

export enum UserRole {
  USER = 'USER',                    // Client final
  ADMIN = 'ADMIN',                  // Administrateur système
  DRIVER = 'DRIVER',                // Chauffeur de livraison
  RESTAURANT_OWNER = 'RESTAURANT_OWNER', // Propriétaire de restaurant
  CATERER = 'CATERER',              // Traiteur/Catering
  BAKER = 'BAKER',                  // Boulanger/Pâtissier
  GROCER = 'GROCER',                // Épicier/Commerçant
  PHARMACIST = 'PHARMACIST',        // Pharmacien
  CLEANER = 'CLEANER',              // Service de nettoyage
  LAUNDRY = 'LAUNDRY',              // Service de blanchisserie
  BEAUTY_SALON = 'BEAUTY_SALON',    // Salon de beauté
  BARBER = 'BARBER',                // Barbier/Coiffeur
  FITNESS_TRAINER = 'FITNESS_TRAINER', // Entraîneur sportif
  TUTOR = 'TUTOR',                  // Professeur particulier
  TECHNICIAN = 'TECHNICIAN',        // Technicien (électricien, plombier, etc.)
  PHOTOGRAPHER = 'PHOTOGRAPHER',    // Photographe
  MUSICIAN = 'MUSICIAN',            // Musicien/Artiste
  TRANSLATOR = 'TRANSLATOR',        // Traducteur/Interprète
  LAWYER = 'LAWYER',                // Avocat/Conseiller juridique
  ACCOUNTANT = 'ACCOUNTANT',        // Comptable
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @ManyToMany(() => Service, (service) => service.favorites)
  @JoinTable({
    name: 'user_favorites',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'serviceId', referencedColumnName: 'id' },
  })
  favorites: Service[];
} 