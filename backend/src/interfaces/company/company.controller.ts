import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CompanyService } from '../../application/company/company.service';

@Controller('admin/companies') // ✅ THIS WAS MISSING
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(
    @Req() req: any,
    @Body('name') name: string,
    @Body('emailDomain') emailDomain: string,
  ) {
    return this.companyService.createCompany(
      req.user.userId,
      name,
      emailDomain,
    );
  }
}
