import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Item } from 'src/items/entities/item.entity';
import { CollectionPointCategory } from 'src/collection-points/entities/collection-point-category.entity';
import { EventCategory } from 'src/events/entities/event-category.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Item, (item) => item.predictedCategory)
  items: Item[];

  @OneToMany(() => CollectionPointCategory, (cpc) => cpc.category)
  collectionPointCategories: CollectionPointCategory[];

  @OneToMany(() => EventCategory, (ec) => ec.category)
  eventCategories: EventCategory[];
}
