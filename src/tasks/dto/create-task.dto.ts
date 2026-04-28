import {
  IsEnum,
  IsString,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../interfaces/task.interface';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implémenter la page de login',
    description: 'Titre de la tâche',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200, {
    message: 'Le titre de la tâche doit faire au maximum 200 caractères',
  })
  title: string;

  @ApiPropertyOptional({
    example: 'Créer le formulaire avec validation',
    description: 'Description détaillée',
    maxLength: 2000,
  })
  @IsString()
  @MaxLength(2000, {
    message: 'La description de la tâche doit faire au maximum 2000 caractères',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    default: TaskStatus.TODO,
    description: 'Statut de la tâche',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    description: 'Priorité de la tâche',
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID du projet parent',
  })
  @IsUUID('4', { message: "L'ID du projet doit être un UUID valide" })
  projectId: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: "UUID de l'utilisateur assigné",
  })
  @IsUUID('4', { message: "L'ID de l'assigné doit être un UUID valide" })
  @IsOptional()
  assigneeId?: string;
}
