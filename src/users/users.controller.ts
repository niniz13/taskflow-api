import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './interface/user.interface';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un utilisateur (ADMIN uniquement)' })
  @ApiCreatedResponse({ description: 'Utilisateur créé avec succès' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  @ApiForbiddenResponse({ description: 'Réservé aux ADMIN' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister tous les utilisateurs' })
  @ApiOkResponse({ description: 'Liste des utilisateurs' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiOkResponse({ description: 'Utilisateur trouvé' })
  @ApiNotFoundResponse({ description: 'Utilisateur introuvable' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un utilisateur (ADMIN ou propriétaire)' })
  @ApiOkResponse({ description: 'Utilisateur mis à jour' })
  @ApiNotFoundResponse({ description: 'Utilisateur introuvable' })
  @ApiForbiddenResponse({
    description: "Réservé à l'ADMIN ou au propriétaire du compte",
  })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: { id: string; role: UserRole },
  ) {
    return this.usersService.update(id, updateUserDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un utilisateur (ADMIN uniquement)' })
  @ApiNoContentResponse({ description: 'Utilisateur supprimé' })
  @ApiNotFoundResponse({ description: 'Utilisateur introuvable' })
  @ApiForbiddenResponse({ description: 'Réservé aux ADMIN' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
