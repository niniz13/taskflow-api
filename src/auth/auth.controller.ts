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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se connecter et obtenir un token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Connexion réussie, retourne un access_token' })
  @ApiUnauthorizedResponse({ description: 'Email ou mot de passe invalide' })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: "Récupérer le profil de l'utilisateur connecté" })
  @ApiOkResponse({ description: "Profil de l'utilisateur courant" })
  @ApiUnauthorizedResponse({ description: 'Token manquant ou invalide' })
  me(@CurrentUser() user: { id: string; email: string; role: string }) {
    return this.usersService.findOne(user.id);
  }
}
