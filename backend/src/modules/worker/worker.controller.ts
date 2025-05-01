import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';

import { WorkerService } from './worker.service';

import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetAllReturnDto, GetByIdReturnDto } from './dto/swagger-examples';
import { WorkerCreateDto, WorkerUpdateDto } from './dto';

@ApiTags('Worker Controller')
@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @ApiOperation({ summary: 'Get salary of all workers' })
  @ApiResponse({
    status: 200,
    type: String,
    description: 'Returns salary of all workers',
  })
  @Get('/salary')
  public async getSalaryOfAllWorkers() {
    const salary = await this.workerService.getSalaryOfAllWorkers();
    return { salary };
  }
  
  @ApiOperation({ summary: 'Get salary by worker id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Worker ID' })
  @ApiResponse({
    status: 200,
    type: String,
    description: 'Returns salary of the worker by id',
  })
  @Get('/salary/:id')
  public async getSalaryByWorkerId(@Param('id') id: string) {
    const salary = await this.workerService.getSalaryByWorkerId(id);
    return { salary };
  }

  @ApiOperation({ summary: 'Get all workers' })
  @ApiResponse({
    status: 200,
    type: GetAllReturnDto,
  })
  @Get('/')
  public async getAll() {
    const workers = await this.workerService.getAll();
    return { workers };
  }

  @ApiOperation({ summary: 'Get worker by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Worker ID' })
  @ApiResponse({
    status: 200,
    type: GetByIdReturnDto,
  })
  @Get('/:id')
  public async getById(@Param('id') id: string) {
    const worker = await this.workerService.getById(id);
    return { worker };
  }

  @ApiOperation({ summary: 'Create a new worker' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created',
    type: GetByIdReturnDto,
  })
  @ApiBody({
    type: WorkerCreateDto,
    description: 'Example of object to creating a worker',
  })
  @Post('/')
  public async create(@Body() body: WorkerCreateDto) {
    const worker = await this.workerService.create(body);
    return { worker };
  }

  @ApiOperation({ summary: 'Update worker by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Worker ID' })
  @ApiBody({
    type: WorkerUpdateDto,
    description: 'Example of object to updating a worker',
  })
  @ApiResponse({
    status: 200,
    type: GetByIdReturnDto,
  })
  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() body: WorkerUpdateDto) {
    const worker = await this.workerService.update(id, body);
    return { worker };
  }

  @ApiOperation({ summary: 'Delete worker by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Worker ID' })
  @ApiResponse({
    status: 200,
    type: GetByIdReturnDto,
  })
  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    const worker = await this.workerService.delete(id);
    return { worker };
  }
}
