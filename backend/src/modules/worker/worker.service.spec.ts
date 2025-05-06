import { Test, TestingModule } from '@nestjs/testing';
import { WorkerService } from './worker.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Worker } from '../../shared/entities/worker.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ErrorService } from '../error/error.service';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { workerRepositoryMock } from 'src/shared/mocks/worker.repository.mock';
import { cacheMock } from 'src/shared/mocks/cache.mock';
import { errorServiceMock } from 'src/shared/mocks/error.mock';
import {
  employeeFixture,
  generateWorkerTree,
  managerFixture,
  salaryFixture,
} from 'src/shared/fixtures';

describe('WorkerServiceTests', () => {
  let service: WorkerService;
  let repo: jest.Mocked<Repository<Worker>>;
  let cache: jest.Mocked<Cache>;
  let errorService: jest.Mocked<ErrorService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        {
          provide: getRepositoryToken(Worker),
          useValue: workerRepositoryMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheMock,
        },
        {
          provide: ErrorService,
          useValue: errorServiceMock,
        },
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
    repo = module.get(getRepositoryToken(Worker));
    cache = module.get(CACHE_MANAGER);
    errorService = module.get(ErrorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  const testCases: [string, number, string, string, Worker][] = [
    ['employeeEmp', 1, '2025-01-01', '1150', employeeFixture],
    ['managerEmp', 1, '2025-01-01', '1262', managerFixture],
    ['salaryEmp', 2, '2025-01-01', '1060.3716', salaryFixture],
  ];

  test.each(testCases)(
    '%s salary with %d depth and %s date',
    async (name, depth, date, result, worker) => {
      const subordinates = generateWorkerTree(worker, depth);
      cache.get.mockResolvedValueOnce(null);
      repo.findOneBy.mockResolvedValueOnce(worker);
      jest.spyOn(Date, 'now').mockReturnValue(new Date(date).getTime());
      repo.find.mockImplementation((options) => {
        const { bossId } = options!.where as { bossId: string };
        return Promise.resolve(
          subordinates.filter((sub) => {
            return bossId === sub.bossId;
          }),
        );
      });
      cache.set.mockResolvedValueOnce(null);
      await expect(service.getSalaryByWorkerId(worker.id)).resolves.toEqual(
        result,
      );
    },
  );

  it('salary all workers', async () => {
    const workers = [salaryFixture, ...generateWorkerTree(salaryFixture, 1)];
    cache.get.mockResolvedValueOnce(null);
    repo.find
      .mockResolvedValueOnce(workers)
      .mockImplementation((options) => {
        const { bossId } = options!.where as { bossId: string };
        return Promise.resolve(
          workers.filter((sub) => {
            return bossId === sub.bossId;
          }),
        );
      });
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-01-01').getTime());
    cache.set.mockResolvedValueOnce(null);
    await expect(service.getSalaryOfAllWorkers()).resolves.toEqual('3457.2');
  });

  it('should return workers from cache', async () => {
    const workers = [{ id: '1' }] as any;
    cache.get.mockResolvedValueOnce(workers);
    await expect(service.getAll()).resolves.toBe(workers);
  });

  it('should throw notFound if no workers in DB', async () => {
    cache.get.mockResolvedValueOnce(undefined);
    repo.find.mockResolvedValueOnce([]);
    await expect(service.getAll()).rejects.toThrow('Not Found');
  });

  it('should return worker from cache by id', async () => {
    const worker = { id: '1' } as any;
    cache.get.mockResolvedValueOnce(worker);
    await expect(service.getById('1')).resolves.toBe(worker);
  });

  it('should create a new worker', async () => {
    const dto = { name: 'test' } as any;
    repo.findOneBy.mockResolvedValueOnce(null);
    repo.create.mockReturnValueOnce(dto);
    repo.save.mockResolvedValueOnce(dto);
    await expect(service.create(dto)).resolves.toBe(dto);
    expect(cache.del).toHaveBeenCalledWith(expect.any(String));
  });

  it('should throw conflict if worker exists', async () => {
    const dto = employeeFixture;
    repo.findOneBy.mockResolvedValueOnce(dto);
    await expect(service.create(dto)).rejects.toThrow('Conflict');
  });
});
