import { Inject, Injectable } from '@nestjs/common';

import { cacheConsts } from '../../shared/constants/cache.const';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { ErrorService } from '../error/error.service';
import { Worker } from '../../shared/entities/worker.entity';
import { WorkerCreateDto, WorkerUpdateDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EWorkerRole, IWorker } from '../../shared/interfaces';

@Injectable()
export class WorkerService {
  constructor(
    private readonly errorService: ErrorService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    @InjectRepository(Worker) private workersRepository: Repository<Worker>,
  ) {}

  private async calculateSalary(worker: Worker): Promise<number> {
    let salary = worker.getCalculatedSalaryByYears();

    if (worker.role === EWorkerRole.EMPLOYEE) {
      return salary;
    }

    const subordinates = await this.workersRepository
      .createQueryBuilder('worker')
      .leftJoinAndSelect('worker.subordinates', 'worker')
      .getMany();

    if (worker.role === EWorkerRole.MANAGER && subordinates.length > 0) {
      for (const sub of subordinates) {
        const subSalary = sub.getCalculatedSalaryByYears();
        salary += subSalary * 0.005;
      }
    }

    if (worker.role === EWorkerRole.SALES && subordinates.length > 0) {
      for (const sub of subordinates) {
        const subSalary = await this.calculateSalary(sub);
        salary += subSalary * 0.003;
      }
    }
    return salary;
  }

  public async getAll(): Promise<IWorker[]> {
    let workers = await this.cacheService.get<IWorker[]>(cacheConsts.allWorkers);
    if (workers) {
      return workers;
    }
    workers = await this.workersRepository.find();
    if (!workers || workers.length === 0) {
      throw await this.errorService.notFound();
    }
    // const refactoredWorkers = workersByRepo.map(async (worker) => {
    //   worker.calculated_salary = await this.calculateSalary(worker);
    //   return worker;
    // });
    // workersByRepo = await Promise.all(refactoredWorkers);
    await this.cacheService.set(cacheConsts.allWorkers, workers);
    return workers;
  }

  public async getById(id: string): Promise<IWorker> {
    let worker = await this.cacheService.get<IWorker>(
      cacheConsts.workerById + id,
    );
    if (worker) {
      return worker;
    }
    worker = await this.workersRepository.findOneBy({ id });
    if (!worker) {
      throw await this.errorService.notFound();
    }
    await this.cacheService.set(cacheConsts.workerById + id, worker);
    return worker;
  }

  public async getSalaryByWorkerId(id: string): Promise<number> {
    let salary = await this.cacheService.get<number>(
      cacheConsts.salaryById + id,
    );
    if (salary) {
      return salary;
    }
    const worker = await this.workersRepository.findOneBy({ id });
    if (!worker) {
      throw await this.errorService.notFound();
    }
    salary = await this.calculateSalary(worker);
    await this.cacheService.set(cacheConsts.salaryById + id, salary);
    return salary;
  }

  public async getSalaryOfAllWorkers(): Promise<number> {
    let allSalary = await this.cacheService.get<number>(cacheConsts.allSalary);
    if (allSalary) {
      return allSalary;
    }
    allSalary = 0;
    const workers = await this.workersRepository.find();
    if (!workers || workers.length === 0) {
      throw await this.errorService.notFound();
    }
    for (const worker of workers) {
      allSalary += await this.calculateSalary(worker);
    }
    await this.cacheService.set(cacheConsts.allSalary, allSalary);
    return allSalary;
  }

  public async create(body: WorkerCreateDto): Promise<IWorker> {
    let worker = await this.workersRepository.findOneBy(body);
    if (worker) {
      throw await this.errorService.conflict();
    }
    worker = this.workersRepository.create(body);
    worker = await this.workersRepository.save(worker);
    await this.cacheService.del(cacheConsts.allWorkers);
    await this.cacheService.del(cacheConsts.allSalary);
    return worker;
  }

  public async update(id: string, body: WorkerUpdateDto): Promise<IWorker> {
    const worker = await this.workersRepository.findOneBy({ id });
    if (!worker) {
      throw await this.errorService.notFound();
    }
    await this.workersRepository.update(id, body);
    await this.cacheService.del(cacheConsts.allWorkers);
    await this.cacheService.del(cacheConsts.workerById + id);
    await this.cacheService.del(cacheConsts.salaryById + id);
    return this.getById(id);
  }

  public async delete(id: string): Promise<IWorker> {
    const worker = await this.workersRepository.findOneBy({ id });
    if (!worker) {
      throw await this.errorService.notFound();
    }
    await this.workersRepository.delete(id);
    await this.cacheService.del(cacheConsts.allWorkers);
    await this.cacheService.del(cacheConsts.workerById + id);
    await this.cacheService.del(cacheConsts.salaryById + id);
    return worker;
  }
}
