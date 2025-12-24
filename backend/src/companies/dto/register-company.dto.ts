import { IsEmail, IsString } from 'class-validator';

export class RegisterCompanyDto {
  @IsEmail()
  email: string;     // founder email

  @IsString()
  password: string;

  @IsString()
  companyName: string;

  @IsString()
  emailDomain: string;  // for eg: mycompany.com
}
