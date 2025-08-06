import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address for login',
    format: 'email'
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'User password for login (must contain uppercase, lowercase, and number)',
    minLength: 6,
    maxLength: 50
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { //NOSONAR
      message: 'The password must have an uppercase, lowercase letter and a number'
    }
  )
  password: string;
}
