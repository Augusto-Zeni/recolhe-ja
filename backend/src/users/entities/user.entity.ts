import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { CollectionPoint } from '../../collection-points/entities/collection-point.entity';
import { Event } from '../../events/entities/event.entity';
import { EventParticipant } from '../../events/entities/event-participant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ nullable: true })
  googleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  @OneToMany(
    () => CollectionPoint,
    (collectionPoint) => collectionPoint.user,
  )
  collectionPoints: CollectionPoint[];

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(
    () => EventParticipant,
    (eventParticipant) => eventParticipant.user,
  )
  eventParticipants: EventParticipant[];
}