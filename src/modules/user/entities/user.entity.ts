import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsEmail()
  @Column()
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  refreshToken: string | null;

  @Exclude()
  @Column({ nullable: true })
  hash: string;

  @Column({ nullable: true })
  googleId: string;

  @CreateDateColumn()
  createTimeStamp: Date;

  @UpdateDateColumn()
  updateTimeStamp: Date;

  @DeleteDateColumn({ default: null })
  deleteTimeStamp: Date | null;
}
