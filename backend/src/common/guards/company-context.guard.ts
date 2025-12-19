import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuthenticatedRequest } from '../types/request-context';

@Injectable()
export class CompanyContextGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const companyId = req.headers['x-company-id'] as string;
    if (!companyId) {
      throw new ForbiddenException('Company context missing');
    }

    const membership = await this.prisma.companyMember.findUnique({
      where: {
        userId_companyId: {
          userId: req.user.userId,
          companyId,
        },
      },
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new ForbiddenException('No access to this company');
    }

    req.company = {
      companyId,
      companyMemberId: membership.id,
      role: membership.role,
    };

    return true;
  }
}
