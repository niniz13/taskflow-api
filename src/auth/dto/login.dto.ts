import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'alice@taskflow.dev',
    description: 'Adresse email du compte',
  })
  @IsEmail({}, { message: 'Adresse email invalide' })
  email!: string;

  @ApiProperty({
    example: 'MotDePasse123',
    description: 'Mot de passe du compte',
    minLength: 8,
    writeOnly: true,
  })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  password!: string;
}