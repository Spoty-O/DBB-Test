export enum EWorkerRole {
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
  SALES = 'Sales',
}

export interface IWorker {
  id: string;
  name: string;
  date: Date;
  base_salary: string;
  role: EWorkerRole;
  calculated_salary?: string;
  bossId?: string;
}
