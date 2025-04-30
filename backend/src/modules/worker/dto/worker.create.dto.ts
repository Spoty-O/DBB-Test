import { OmitType } from '@nestjs/swagger';
import { WorkerDto } from './worker.dto';

export class WorkerCreateDto extends OmitType(WorkerDto, [
  'id',
  'calculated_salary',
] as const) {}
