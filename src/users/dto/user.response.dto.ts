import { Exclude } from 'class-transformer';
import { UserRole } from '../interface/user.interface';

export class UserResponseDto {
  id: string;

  email: string;

  @Exclude()
  passwordHash: string;

  name: string;

  role: UserRole;

  createdAt: Date;

  updatedAt: Date;

  teams: any[];
}
