import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from './event.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class EventParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column()
  userId: string;

  @Column()
  status: string; // e.g., 'pending', 'accepted', 'rejected'

  @ManyToOne(() => Event, (event) => event.eventParticipants)
  event: Event;

  @ManyToOne(() => User, (user) => user.eventParticipants)
  user: User;
}