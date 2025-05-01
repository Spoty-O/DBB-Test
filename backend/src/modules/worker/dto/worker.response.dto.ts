import { ApiProperty, OmitType } from '@nestjs/swagger';
import { WorkerDto } from './worker.dto';

export class WorkerResponseDto extends OmitType(WorkerDto, [
  'base_salary',
] as const) {
  @ApiProperty({
    type: String,
    name: 'base_salary',
    description: 'Base salary of the worker',
    example: 1000,
  })
  base_salary!: String;
}
