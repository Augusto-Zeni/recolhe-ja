import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  predictedCategory: string;

  @Column({ type: 'float', nullable: true })
  confidence: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.items)
  user: User;

  @ManyToOne(() => Category, (category) => category.items)
  category: Category;
}