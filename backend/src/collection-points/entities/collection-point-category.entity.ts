import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { CollectionPoint } from 'src/collection-points/entities/collection-point.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class CollectionPointCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  collectionPointId: string;

  @Column()
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CollectionPoint, (collectionPoint) => collectionPoint.collectionPointCategories)
  collectionPoint: CollectionPoint;

  @ManyToOne(() => Category, (category) => category.collectionPointCategories)
  category: Category;
}
