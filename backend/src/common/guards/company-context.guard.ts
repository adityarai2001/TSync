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

    if (!req.user?.userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const membership = await this.prisma.companyMember.findFirst({
      where: {
        userId: req.user.userId,
        status: 'ACTIVE',
      },
    });

    if (!membership) {
      throw new ForbiddenException('No active company membership');
    }

    req.user.companyId = membership.companyId;
    req.user.companyMemberId = membership.id;
    if (membership.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Super admin cannot act as company member');
    }

    req.user.companyRole = membership.role as 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';

    return true;
  }
}
