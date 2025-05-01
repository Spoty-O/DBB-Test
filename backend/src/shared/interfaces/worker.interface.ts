import Decimal from "decimal.js";

export enum EWorkerRole {
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
  SALES = 'Sales',
}

export interface IWorker {
  id: string;
  name: string;
  date: Date;
  base_salary: Decimal;
  role: EWorkerRole;
  bossId?: string;
}
