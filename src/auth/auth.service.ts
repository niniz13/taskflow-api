import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    // TODO:
    // 1. Charger l'user avec le hash via usersService.findByEmailWithPassword()
    // 2. Comparer avec bcrypt.compare()
    // 3. Si match → retourner l'user sans passwordHash
    // 4. Sinon → retourner null
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // TODO:
    // Créer le payload JWT { sub: user.id, email, role }
    // Retourner { access_token: jwtService.sign(payload), user: { id, email, name, role } }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
