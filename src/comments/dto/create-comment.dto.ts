import {
  IsString,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @MaxLength(1000, { message: 'Le contenu du commentaire doit faire au maximum 1000 caractères' })
    content: string;

    @IsUUID('4', { message: "L'ID de la tâche doit être un UUID valide" })
    taskId: string;
    
    @IsUUID('4', { message: "L'ID de l'auteur doit être un UUID valide" })
    authorId: string;
}
