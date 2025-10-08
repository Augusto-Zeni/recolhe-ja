import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EventCategory } from './event-category.entity';
import { EventParticipant } from './event-participant.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lon: number;

  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp' })
  endAt: Date;

  @Column()
  userId: string; // Changed from createdBy to userId for foreign key relationship

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.events)
  user: User;

  @OneToMany(() => EventCategory, (eventCategory) => eventCategory.event)
  eventCategories: EventCategory[];

  @OneToMany(
    () => EventParticipant,
    (eventParticipant) => eventParticipant.event,
  )
  eventParticipants: EventParticipant[];
}