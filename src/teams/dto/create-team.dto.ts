import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    example: 'Équipe Frontend',
    description: "Nom de l'équipe",
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100, {
    message: "Le nom de l'équipe doit faire au maximum 100 caractères",
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Équipe en charge du développement front',
    description: "Description de l'équipe",
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500, {
    message: "La description de l'équipe doit faire au maximum 500 caractères",
  })
  @IsOptional()
  description?: string;
}
