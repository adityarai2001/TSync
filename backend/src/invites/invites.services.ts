import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { InviteStatus } from '@prisma/client';
import { randomBytes } from 'crypto';
import { hashPassword } from '../common/utils/password.util';

@Injectable()
export class InvitesService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvite(userId: string, dto: CreateInviteDto) {
    // 1. Find inviter's company
    const member = await this.prisma.companyMember.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        company: true,
      },
    });

    if (!member) {
      throw new UnauthorizedException('User is not part of any company');
    }

    const { company } = member;

    // 2. Build full email
    const email = `${dto.emailPrefix}@${company.emailDomain}`;

    // 3. Prevent duplicate pending invites
    const existingInvite = await this.prisma.invite.findFirst({
      where: {
        email,
        companyId: company.id,
        status: InviteStatus.PENDING,
      },
    });

    if (existingInvite) {
      throw new BadRequestException('Invite already sent to this email');
    }

    // 4. Generate token + temp password
    const token = randomBytes(32).toString('hex');
    const tempPassword = randomBytes(8).toString('hex');

    // 5. Hash temp password
    const tempPasswordHash = await hashPassword(tempPassword);

    // 6. Store invite
    const invite = await this.prisma.invite.create({
      data: {
        companyId: company.id,
        email,
        role: dto.role,
        token,
        tempPasswordHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    // 7. RETURN RESPONSE (THIS WAS MISSING)
    return {
      inviteId: invite.id,
      token: invite.token,
      email,
      role: invite.role,
      expiresAt: invite.expiresAt,
      tempPassword, // TEMP: for testing; later via email
    };
  }

  async acceptInvite(token: string) {
    // 1. Find invite
    const invite = await this.prisma.invite.findUnique({
      where: { token },
    });

    if (!invite) {
      throw new BadRequestException('Invalid invite token');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Invite already used or expired');
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Invite has expired');
    }

    // 2. Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email: invite.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: invite.email,
          password: invite.tempPasswordHash,
          status: 'ACTIVE',
        },
      });
    }

    // 3. Create company membership
    await this.prisma.companyMember.create({
      data: {
        userId: user.id,
        companyId: invite.companyId,
        role: invite.role,
        status: 'ACTIVE',
      },
    });

    // 4. Mark invite as used
    await this.prisma.invite.update({
      where: { id: invite.id },
      data: { status: InviteStatus.USED },
    });

    // 5. Return success
    return {
      message: 'Invite accepted successfully',
      email: user.email,
    };
  }
}
