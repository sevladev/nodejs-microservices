import { randomUUID } from 'crypto';
import moment from 'moment';

export class BaseEntity {
  created_at: number;

  updated_at: number;

  id: string;

  constructor() {
    this.id = randomUUID();
    this.created_at = moment().unix();
    this.updated_at = moment().unix();
  }
}
