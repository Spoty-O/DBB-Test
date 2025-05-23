import { OmitType, PartialType } from '@nestjs/swagger';
import { WorkerDto } from './worker.dto';

export class WorkerUpdateDto extends PartialType(
  OmitType(WorkerDto, ['id'] as const),
) {}
