import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { CollectionPointCategory } from '../../collection-points/entities/collection-point-category.entity';
import { EventCategory } from '../../events/entities/event-category.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Item, (item) => item.predictedCategory)
  items: Item[];

  @OneToMany(() => CollectionPointCategory, (cpc) => cpc.category)
  collectionPointCategories: CollectionPointCategory[];

  @OneToMany(() => EventCategory, (ec) => ec.category)
  eventCategories: EventCategory[];
}