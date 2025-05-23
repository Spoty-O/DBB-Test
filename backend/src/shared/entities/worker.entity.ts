import { IWorker, EWorkerRole } from '../interfaces';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { calculateSalaryByYears, DecimalTransformer } from '../utils';
import Decimal from 'decimal.js';

@Entity('workers')
export class Worker implements IWorker {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  public name!: string;

  @Column({ type: 'timestamp', nullable: false })
  public date!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: DecimalTransformer })
  public base_salary!: Decimal;

  @Column({ type: 'enum', enum: EWorkerRole, nullable: false })
  public role!: EWorkerRole;

  getCalculatedSalaryByYears(): Decimal {
    return calculateSalaryByYears(this);
  }

  @Column({ nullable: true })
  bossId?: string;

  @ManyToOne(() => Worker, (worker) => worker.subordinates, {
    nullable: true,
  })
  @JoinColumn({ name: 'bossId', referencedColumnName: 'id' })
  boss?: Worker;

  @OneToMany(() => Worker, (worker) => worker.boss)
  subordinates!: Worker[];
}
