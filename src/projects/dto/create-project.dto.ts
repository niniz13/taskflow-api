import {
  IsEnum,
  IsString,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../interfaces/project.interface';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Refonte du site',
    description: 'Nom du projet',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200, {
    message: 'Le nom du projet doit faire au maximum 200 caractères',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Migration vers Next.js',
    description: 'Description du projet',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000, {
    message: 'La description du projet doit faire au maximum 1000 caractères',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
    description: 'Statut du projet',
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: "UUID de l'équipe associée",
  })
  @IsUUID('4', { message: "L'ID de l'équipe doit être un UUID valide" })
  teamId?: string;
}
