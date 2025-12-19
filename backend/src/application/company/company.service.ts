import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RecordStatus, CompanyRole } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(
    creatorUserId: string,
    name: string,
    emailDomain: string,
  ) {
    const existing = await this.prisma.company.findFirst({
      where: { emailDomain },
    });

    if (existing) {
      throw new ConflictException('Email domain already in use');
    }

    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name,
          emailDomain,
          status: RecordStatus.ACTIVE,
        },
      });

      await tx.companyMember.create({
        data: {
          userId: creatorUserId,
          companyId: company.id,
          role: CompanyRole.ADMIN,
          status: RecordStatus.ACTIVE,
        },
      });

      return company;
    });
  }
}
