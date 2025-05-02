import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  // @Expose()
  // @Exclude()
  @MinLength(6)
  password: string;

  role: string;
}
