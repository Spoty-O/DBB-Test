import Decimal from 'decimal.js';
import { employeeFixture, managerFixture, salaryFixture } from '../fixtures';
import { Worker } from '../entities';

describe('WorkerUtilTests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const cases: [string, string, Worker, Decimal][] = [
    ['employee', '2021-01-01', employeeFixture, new Decimal(1030)],
    ['manager', '2021-01-01', managerFixture, new Decimal(1050)],
    ['salary', '2021-01-01', salaryFixture, new Decimal (1010)],
  ];

  test.each(cases)('%s salary from 2020-01-01 to %s', (name, date, obj, expRes) => {
    const worker = obj;
    jest.spyOn(Date, 'now').mockReturnValue(new Date(date).getTime());
    const result = worker.getCalculatedSalaryByYears();
    expect(result).toEqual(expRes);
  });
});
