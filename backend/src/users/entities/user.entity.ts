import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Item } from 'src/items/entities/item.entity';
import { CollectionPoint } from 'src/collection-points/entities/collection-point.entity';
import { Event } from 'src/events/entities/event.entity';
import { EventParticipant } from 'src/events/entities/event-participant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Exclude()
  @Column({ nullable: true })
  passwordHash: string;

  @Exclude()
  @Column({ nullable: true })
  googleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  @OneToMany(() => CollectionPoint, (collectionPoint) => collectionPoint.user)
  collectionPoints: CollectionPoint[];

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(() => EventParticipant, (eventParticipant) => eventParticipant.user)
  eventParticipants: EventParticipant[];
}
