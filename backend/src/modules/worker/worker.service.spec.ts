import { Test, TestingModule } from '@nestjs/testing';
import { WorkerService } from './worker.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Worker } from '../../shared/entities/worker.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ErrorService } from '../error/error.service';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

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
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: ErrorService,
          useValue: {
            notFound: jest.fn().mockResolvedValue(new Error('Not Found')),
            conflict: jest.fn().mockResolvedValue(new Error('Conflict')),
          },
        },
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
    repo = module.get(getRepositoryToken(Worker));
    cache = module.get(CACHE_MANAGER);
    errorService = module.get(ErrorService);
  });

  it('should return workers from cache', async () => {
    const workers = [{ id: '1' }] as any;
    cache.get.mockResolvedValueOnce(workers);
    expect(await service.getAll()).toBe(workers);
  });

  it('should throw notFound if no workers in DB', async () => {
    cache.get.mockResolvedValueOnce(undefined);
    repo.find.mockResolvedValueOnce([]);
    await expect(service.getAll()).rejects.toThrow('Not Found');
  });

  it('should return worker from cache by id', async () => {
    const worker = { id: '1' } as any;
    cache.get.mockResolvedValueOnce(worker);
    expect(await service.getById('1')).toBe(worker);
  });

  it('should create a new worker', async () => {
    const dto = { name: 'test' } as any;
    repo.findOneBy.mockResolvedValueOnce(null);
    repo.create.mockReturnValueOnce(dto);
    repo.save.mockResolvedValueOnce(dto);
    const result = await service.create(dto);
    expect(result).toBe(dto);
    expect(cache.del).toHaveBeenCalledWith(expect.any(String));
  });

  it('should throw conflict if worker exists', async () => {
    const dto = { name: 'exists' } as any;
    repo.findOneBy.mockResolvedValueOnce(dto);
    await expect(service.create(dto)).rejects.toThrow('Conflict');
  });
});
