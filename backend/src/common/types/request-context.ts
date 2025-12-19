export interface CompanyContext {
  companyId: string;
  companyMemberId: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
  company?: CompanyContext;
}
