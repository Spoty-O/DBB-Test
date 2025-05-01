import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { randomUUID } from 'crypto';
import Decimal from 'decimal.js';
import { EWorkerRole, IWorker } from 'src/shared/interfaces';

export class WorkerDto implements IWorker {
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'Worker ID',
    example: randomUUID(),
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    type: String,
    name: 'name',
    description: 'Worker name',
    example: 'John Doe',
  })
  @IsString()
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    type: Date,
    name: 'date',
    description: 'Workers employment date',
    example: '2023-10-01',
  })
  @IsDate()
  date!: Date;

  @ApiProperty({
    type: Number,
    name: 'base_salary',
    description: 'Base salary of the worker',
    example: 1000,
  })
  @IsDecimal()
  @Transform(({ value }) => new Decimal(value))
  base_salary!: Decimal;

  @ApiProperty({
    enum: EWorkerRole,
    name: 'role',
    description: 'Role of the worker',
    example: EWorkerRole.EMPLOYEE,
  })
  @IsEnum(EWorkerRole)
  role!: EWorkerRole;

  @ApiProperty({
    type: String,
    name: 'bossId',
    description: "ID of the worker's boss",
    example: randomUUID(),
  })
  @IsUUID()
  @IsOptional()
  bossId?: string;
}
