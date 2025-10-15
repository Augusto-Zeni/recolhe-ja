import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CollectionPointCategory } from 'src/collection-points/entities/collection-point-category.entity';

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

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.collectionPoints)
  user: User;

  @OneToMany(() => CollectionPointCategory, (cpc) => cpc.collectionPoint)
  collectionPointCategories: CollectionPointCategory[];
}
