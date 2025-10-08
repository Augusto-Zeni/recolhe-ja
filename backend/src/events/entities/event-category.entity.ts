import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from './event.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class EventCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => Event, (event) => event.eventCategories)
  event: Event;

  @ManyToOne(() => Category, (category) => category.eventCategories)
  category: Category;
}