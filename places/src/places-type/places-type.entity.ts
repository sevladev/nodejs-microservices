import { BaseEntity } from '../../src/commons/base-entity';

export class PlacesTypeEntity extends BaseEntity {
  name: string;

  slug: string;

  constructor({
    name,
    slug,
  }: Omit<PlacesTypeEntity, 'created_at' | 'updated_at' | 'id'>) {
    super();

    this.name = name;

    this.slug = slug;
  }
}
