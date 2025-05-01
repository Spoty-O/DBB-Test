import Decimal from 'decimal.js';
import { Worker } from '../entities';
import { EWorkerRole, IWorker } from '../interfaces';
import { randomUUID } from 'crypto';
import { calculateSalaryByYears } from '../utils';

const employeeFixture: Worker = {
  id: randomUUID(),
  name: 'John Employee',
  date: new Date('2020-01-01'),
  base_salary: new Decimal(1000),
  role: EWorkerRole.EMPLOYEE,
  bossId: undefined,
  getCalculatedSalaryByYears(): Decimal {
    return calculateSalaryByYears(this);
  },
  subordinates: [],
};

const managerFixture: Worker = {
  id: randomUUID(),
  name: 'John Manager',
  date: new Date('2020-01-01'),
  base_salary: new Decimal(1000),
  role: EWorkerRole.MANAGER,
  bossId: undefined,
  getCalculatedSalaryByYears(): Decimal {
    return calculateSalaryByYears(this);
  },
  subordinates: [],
};

const salaryFixture: Worker = {
  id: randomUUID(),
  name: 'John Manager',
  date: new Date('2020-01-01'),
  base_salary: new Decimal(1000),
  role: EWorkerRole.SALES,
  bossId: undefined,
  getCalculatedSalaryByYears(): Decimal {
    return calculateSalaryByYears(this);
  },
  subordinates: [],
};

export { employeeFixture, managerFixture, salaryFixture };
