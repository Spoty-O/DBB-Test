import { EWorkerRole } from '../interfaces';
import { Worker } from '../entities';

export const calculateSalaryByYears = (worker: Worker): number => {
  const now = new Date();
  const years = now.getFullYear() - worker.date.getFullYear();
  const base = parseFloat(worker.base_salary);

  const percent = {
    [EWorkerRole.EMPLOYEE]: Math.min(years * 0.03, 0.3),
    [EWorkerRole.MANAGER]: Math.min(years * 0.05, 0.4),
    [EWorkerRole.SALES]: Math.min(years * 0.01, 0.35),
  }[worker.role];
  
  const calculated_salary = base + base * percent;
  return calculated_salary;
};
