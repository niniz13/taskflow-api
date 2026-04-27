import { UsersService } from 'src/users/users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(AuthGuard('local')) // Passport valide email/password
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    // TODO: req.user est l'utilisateur validé par LocalStrategy
    // Appeler authService.login(req.user)
    return this.authService.login(req.user);
  }

  @Get('me')
  me(@CurrentUser() user: { id: string; email: string; role: string }) {
    // TODO: retourner usersService.findOne(user.id)
    return this.usersService.findOne(user.id);
  }
}
