import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { EWorkerRole, IWorker } from 'src/shared/interfaces';
import { WorkerDto } from '../worker.dto';
import { WorkerResponseDto } from '../worker.response.dto';

let temp: WorkerResponseDto = {
  id: randomUUID(),
  name: 'name',
  date: new Date('2023-10-01'),
  base_salary: '1000',
  role: EWorkerRole.EMPLOYEE,
  bossId: randomUUID(),
};

export class GetAllReturnDto {
  @ApiProperty({
    type: [WorkerResponseDto],
    example: [temp, temp],
    description: 'Returns list of all workers',
  })
  public workers!: WorkerResponseDto[];
}
