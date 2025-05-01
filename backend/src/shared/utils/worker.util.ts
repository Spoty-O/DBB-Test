import { EWorkerRole } from '../interfaces';
import { Worker } from '../entities';
import { ValueTransformer } from 'typeorm';
import Decimal from 'decimal.js';

export const calculateSalaryByYears = (worker: Worker): Decimal => {
  const years = new Decimal(
    Math.floor(
      (Date.now() - worker.date.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
    ),
  );
  const base = worker.base_salary;

  const percent = {
    [EWorkerRole.EMPLOYEE]: Decimal.min(years.mul(0.03), 0.3),
    [EWorkerRole.MANAGER]: Decimal.min(years.mul(0.05), 0.4),
    [EWorkerRole.SALES]: Decimal.min(years.mul(0.01), 0.35),
  }[worker.role];

  const calculated_salary = base.plus(base.mul(percent));
  return calculated_salary;
};

export const DecimalTransformer: ValueTransformer = {
  to: (value: Decimal | string | number): string => {
    return new Decimal(value).toPrecision();
  },
  from: (value: string): Decimal => {
    return new Decimal(value);
  },
};
