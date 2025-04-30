import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { randomUUID } from 'crypto';
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
  base_salary!: string;

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

  @ApiProperty({
    type: Number,
    name: 'calculated_salary',
    description: 'Calculated salary of the worker',
    example: 1200,
    required: false,
    nullable: true,
  })
  @IsDecimal()
  @IsOptional()
  calculated_salary?: string;
}
