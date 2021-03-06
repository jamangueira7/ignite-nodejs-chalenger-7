import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Statement } from '@modules/statements/entities/Statement';

@Entity('users')
export class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Statement, statement => statement.user)
  statement: Account[];

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if(!this.id) {
      this.id = uuid();
    }
  }
}
