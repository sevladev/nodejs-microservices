import { randomUUID } from 'crypto';

export class BaseEntity {
  created_at: Date;

  updated_at: Date;

  id: string;

  constructor() {
    this.id = randomUUID();
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
