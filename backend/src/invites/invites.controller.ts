import { Body, Controller, Post, Req, UseGuards, Param } from '@nestjs/common';
import { InvitesService } from './invites.services';
import { CreateInviteDto } from './dto/create-invite.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createInvite(@Req() req: any, @Body() dto: CreateInviteDto) {
    return this.invitesService.createInvite(req.user.sub, dto);
  }

  @Post('accept/:token')
  acceptInvite(@Param('token') token: string) {
    return this.invitesService.acceptInvite(token);
  }
}
