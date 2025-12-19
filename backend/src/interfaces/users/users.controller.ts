import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CompanyContextGuard } from '../../common/guards/company-context.guard';
import type { AuthenticatedRequest } from '../../common/types/request-context';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard, CompanyContextGuard)
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    return {
      user: req.user,
      company: req.company,
    };
  }
}
