import { Team } from 'src/teams/entities/team.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProjectStatus } from '../interfaces/project.interface';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 200 })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({
      type: 'enum',
      enum: ProjectStatus,
      default: ProjectStatus.DRAFT,
    })
    status: ProjectStatus;

    @ManyToOne(() => Team, (team) => team.id, { onDelete: 'CASCADE' })
    team: Team;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
