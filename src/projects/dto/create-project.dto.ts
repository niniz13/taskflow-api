import {
  IsEnum,
  IsString,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { ProjectStatus } from '../interfaces/project.interface';

export class CreateProjectDto {
  @IsString()
  @MaxLength(200, {
    message: 'Le nom du projet doit faire au maximum 200 caractères',
  })
  name: string;

  @IsString()
  @MaxLength(1000, {
    message: 'La description du projet doit faire au maximum 1000 caractères',
  })
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsUUID('4', { message: "L'ID de l'équipe doit être un UUID valide" })
  teamId?: string;
}
