import {
  IsEnum,
  IsString,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../interfaces/task.interface';

export class CreateTaskDto {
  @IsString()
  @MaxLength(200, {
    message: 'Le titre de la tâche doit faire au maximum 200 caractères',
  })
  title: string;

  @IsString()
  @MaxLength(2000, {
    message: 'La description de la tâche doit faire au maximum 2000 caractères',
  })
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsUUID('4', { message: "L'ID du projet doit être un UUID valide" })
  projectId: string;

  @IsUUID('4', { message: "L'ID de l'assigné doit être un UUID valide" })
  @IsOptional()
  assigneeId?: string;
}
