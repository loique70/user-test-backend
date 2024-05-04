import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 8, { message: 'Password must between 4 and 8 characters' })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
