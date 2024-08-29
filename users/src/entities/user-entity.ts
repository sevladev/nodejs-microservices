import { IRolesTypes } from "../controllers/base-controller";
import { BaseEntity } from "./base-entity";

export class UserEntity extends BaseEntity {
  name: string;
  email: string;
  password: string;
  phone: string;
  is_active?: boolean;
  role?: IRolesTypes;

  constructor({
    name,
    email,
    password,
    phone,
    is_active = true,
    role = "resu",
  }: Omit<UserEntity, "created_at" | "updated_at" | "_id">) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.is_active = is_active;
    this.role = role;
  }
}
