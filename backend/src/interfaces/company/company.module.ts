import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from '../../application/company/company.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
