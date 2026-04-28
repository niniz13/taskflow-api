import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('teams')
@ApiBearerAuth('JWT-auth')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une équipe' })
  @ApiCreatedResponse({ description: 'Équipe créée avec succès' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les équipes' })
  @ApiOkResponse({ description: 'Liste des équipes' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une équipe par ID' })
  @ApiOkResponse({ description: 'Équipe trouvée' })
  @ApiNotFoundResponse({ description: 'Équipe introuvable' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une équipe' })
  @ApiOkResponse({ description: 'Équipe mise à jour' })
  @ApiNotFoundResponse({ description: 'Équipe introuvable' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une équipe' })
  @ApiNoContentResponse({ description: 'Équipe supprimée' })
  @ApiNotFoundResponse({ description: 'Équipe introuvable' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Ajouter un membre à une équipe' })
  @ApiOkResponse({ description: 'Membre ajouté' })
  @ApiNotFoundResponse({ description: 'Équipe ou utilisateur introuvable' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  addMember(@Param('id') teamId: string, @Body('userId') userId: string) {
    return this.teamsService.addMember(teamId, userId);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: "Retirer un membre d'une équipe" })
  @ApiNoContentResponse({ description: 'Membre retiré' })
  @ApiNotFoundResponse({ description: 'Équipe ou utilisateur introuvable' })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  removeMember(@Param('id') teamId: string, @Param('userId') userId: string) {
    return this.teamsService.removeMember(teamId, userId);
  }
}
