import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CollectionPoint } from './collection-point.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class CollectionPointCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  collectionPointId: string;

  @Column()
  categoryId: string;

  @ManyToOne(
    () => CollectionPoint,
    (collectionPoint) => collectionPoint.collectionPointCategories,
  )
  collectionPoint: CollectionPoint;

  @ManyToOne(() => Category, (category) => category.collectionPointCategories)
  category: Category;
}