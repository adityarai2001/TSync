import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './interfaces/auth/auth.module';
import { CompanyModule } from './interfaces/company/company.module';
import { UsersController } from './interfaces/users/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CompanyModule, // ✅ THIS WAS MISSING
  ],
  controllers: [UsersController],
})
export class AppModule {}
