import { Module, OnModuleInit } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { ErrorModule } from '../error/error.module';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from 'src/shared/entities';

@Module({
  providers: [WorkerService],
  controllers: [WorkerController],
  imports: [
    ErrorModule,
    TypeOrmModule.forFeature([Worker]),
  ],
})
export class WorkerModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly workerService: WorkerService,
  ) {}
  public async onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      await Promise.all([console.log('WorkerModule initialized')]);
    }
  }
}
