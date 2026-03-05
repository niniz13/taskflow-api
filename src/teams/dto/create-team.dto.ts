import {
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateTeamDto {
    @IsString()
    @MaxLength(100, { message: 'Le nom de l\'équipe doit faire au maximum 100 caractères' })
    name: string;

    @IsString()
    @MaxLength(500, { message: 'La description de l\'équipe doit faire au maximum 500 caractères' })
    @IsOptional()
    description?: string;
}
