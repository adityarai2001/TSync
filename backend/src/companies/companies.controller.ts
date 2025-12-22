import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './companies.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.gaurd';
import { Roles } from '../common/decorators/roles.decorators';

@Controller('admin/companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.companyService.createCompany(
      req.user.userId,
      body.name,
      body.emailDomain,
    );
  }
}
