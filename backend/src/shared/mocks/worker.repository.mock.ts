import { Repository } from "typeorm";
import { Worker } from "../entities";

export const workerRepositoryMock: Partial<Record<keyof Repository<Worker>, jest.Mock>> = {
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
};