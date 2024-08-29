import moment from "moment";
import { ObjectId } from "mongodb";

export class BaseEntity {
  created_at: number;

  updated_at: number;

  _id: ObjectId;

  constructor() {
    this._id = new ObjectId();
    this.created_at = moment().unix();
    this.updated_at = moment().unix();
  }
}
