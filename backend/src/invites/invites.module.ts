import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.services';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Module({
  controllers: [InvitesController],
  providers: [InvitesService, PrismaService],
})
export class InvitesModule {}