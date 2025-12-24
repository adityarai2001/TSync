import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { RecordStatus, CompanyRole } from '@prisma/client';
import { hashPassword } from '../common/utils/password.util';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  // platform controlled
  async createCompanyBySuperAdmin(
    name: string,
    emailDomain: string,
    adminEmail: string,
    adminPassword: string,
  ) {
    return this.createCompanyInternal(name, emailDomain, adminEmail, adminPassword);
  }

  // Public registration
  async registerCompany(dto: {
    email: string;
    password: string;
    companyName: string;
    emailDomain: string;
  }) {
    const domain = dto.email.split('@')[1];
    if (domain !== dto.emailDomain) {
      throw new BadRequestException('Email does not match company domain');
    }

    return this.createCompanyInternal(
      dto.companyName,
      dto.emailDomain,
      dto.email,
      dto.password,
    );
  }

  // Single internal implementation
  private async createCompanyInternal(
    companyName: string,
    emailDomain: string,
    adminEmail: string,
    adminPassword: string,
  ) {
    const existingDomain = await this.prisma.company.findFirst({
      where: { emailDomain },
    });

    if (existingDomain) {
      throw new ConflictException('Email domain already in use');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: adminEmail,
          password: await hashPassword(adminPassword),
          platformRole: 'USER',
          status: RecordStatus.ACTIVE,
        },
      });

      const company = await tx.company.create({
        data: {
          name: companyName,
          emailDomain,
          status: RecordStatus.ACTIVE,
        },
      });

      await tx.companyMember.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: CompanyRole.ADMIN,
          status: RecordStatus.ACTIVE,
        },
      });

      return {
        companyId: company.id,
        adminEmail: user.email,
      };
    });
  }
}