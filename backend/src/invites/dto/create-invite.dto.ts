import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CompanyRole } from '@prisma/client';

export class CreateInviteDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: 'Email prefix contains invalid characters',
  })
  emailPrefix: string;

  @IsEnum(CompanyRole)
  role: CompanyRole;
}