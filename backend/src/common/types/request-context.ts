export interface CompanyContext {
  companyId: string;
  companyMemberId: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    platformRole?: string;

    companyId?: string;
    companyMemberId?: string;
    companyRole?: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';
  };
}
