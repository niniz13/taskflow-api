import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    this.logger.log(`Création d'une tâche : ${dto.title}`);

    const project = await this.projectsRepository.findOne({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    let assignee: User | undefined;
    if (dto.assigneeId) {
      assignee =
        (await this.usersRepository.findOne({
          where: { id: dto.assigneeId },
        })) ?? undefined;
      if (!assignee) {
        throw new NotFoundException(`User with ID ${dto.assigneeId} not found`);
      }
    }

    const task = this.tasksRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      project,
      assignee,
    });

    return this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['project', 'assignee'] });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project', 'assignee'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    this.logger.log(`Mise à jour de la tâche ${id}`);
    const task = await this.findOne(id);

    if (dto.projectId) {
      const project = await this.projectsRepository.findOne({
        where: { id: dto.projectId },
      });
      if (!project) {
        throw new NotFoundException(
          `Project with ID ${dto.projectId} not found`,
        );
      }
      task.project = project;
    }

    if (dto.assigneeId) {
      const assignee = await this.usersRepository.findOne({
        where: { id: dto.assigneeId },
      });
      if (!assignee) {
        throw new NotFoundException(`User with ID ${dto.assigneeId} not found`);
      }
      task.assignee = assignee;
    }

    Object.assign(task, {
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      status: dto.status ?? task.status,
      priority: dto.priority ?? task.priority,
      updated_at: new Date(),
    });

    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Suppression de la tâche ${id}`);
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
