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
  name: 'John Sales',
  date: new Date('2020-01-01'),
  base_salary: new Decimal(1000),
  role: EWorkerRole.SALES,
  bossId: undefined,
  getCalculatedSalaryByYears(): Decimal {
    return calculateSalaryByYears(this);
  },
  subordinates: [],
};

const generateWorkerTree = (
  worker: Worker,
  depth: number,
  subordinates: Worker[] = [],
): Worker[] => {
  if (depth <= 0) return subordinates;
  const newSubordinates = [
    Object.assign(new Worker(), employeeFixture),
    Object.assign(new Worker(), managerFixture),
  ];
  if (depth > 1)
    newSubordinates.push(Object.assign(new Worker(), salaryFixture));

  for (const sub of newSubordinates) {
    sub.id = randomUUID();
    sub.bossId = worker.id;
  }
  subordinates.push(...newSubordinates);
  const rootWorker = newSubordinates[newSubordinates.length - 1];
  if (!rootWorker) return subordinates;
  return generateWorkerTree(rootWorker, depth - 1, subordinates);
};

export { employeeFixture, managerFixture, salaryFixture, generateWorkerTree };
