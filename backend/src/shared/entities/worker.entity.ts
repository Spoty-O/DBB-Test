import { IWorker, EWorkerRole } from '../interfaces';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { calculateSalaryByYears } from '../utils';

@Entity('workers')
export class Worker implements IWorker {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public name!: string;

  @Column({ type: 'timestamp', nullable: false })
  public date!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  public base_salary!: string;

  @Column({ type: 'enum', enum: EWorkerRole, nullable: false })
  public role!: EWorkerRole;

  public calculated_salary?: string;

  getCalculatedSalaryByYears(): number {
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
