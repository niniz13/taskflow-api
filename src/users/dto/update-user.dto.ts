import { UserRole } from "../interface/user.interface";

export class UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
}