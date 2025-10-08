import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CollectionPointCategory } from './collection-point-category.entity';

@Entity()
export class CollectionPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lon: number;

  @Column()
  address: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  openingHours: string;

  @Column()
  userId: string; // Changed from createdBy to userId for foreign key relationship

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.collectionPoints)
  user: User;

  @OneToMany(() => CollectionPointCategory, (cpc) => cpc.collectionPoint)
  collectionPointCategories: CollectionPointCategory[];
}