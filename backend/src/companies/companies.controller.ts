import { Body, Controller, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { RegisterCompanyDto } from './dto/register-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('register')
  registerCompany(@Body() dto: RegisterCompanyDto) {
    return this.companiesService.registerCompany(dto);
  }
}
