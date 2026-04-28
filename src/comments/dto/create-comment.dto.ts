import { IsString, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Merci pour la mise a jour, je valide cette tache.',
    description: 'Contenu du commentaire',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000, {
    message: 'Le contenu du commentaire doit faire au maximum 1000 caractères',
  })
  content: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID de la tache associee',
  })
  @IsUUID('4', { message: "L'ID de la tâche doit être un UUID valide" })
  taskId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: "UUID de l'auteur du commentaire",
  })
  @IsUUID('4', { message: "L'ID de l'auteur doit être un UUID valide" })
  authorId: string;
}
