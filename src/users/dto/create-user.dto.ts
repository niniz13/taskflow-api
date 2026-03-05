import { UserRole } from "../interface/user.interface";

export class CreateUserDto {
  email: string;
  name: string;
  role?: UserRole;
}