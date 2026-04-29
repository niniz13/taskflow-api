import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    this.logger.log("Création d'un commentaire");

    const task = await this.tasksRepository.findOne({
      where: { id: dto.taskId },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${dto.taskId} not found`);
    }

    const author = await this.usersRepository.findOne({
      where: { id: dto.authorId },
    });
    if (!author) {
      throw new NotFoundException(`User with ID ${dto.authorId} not found`);
    }

    const comment = this.commentsRepository.create({
      content: dto.content,
      task,
      author,
    });

    return this.commentsRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({ relations: ['author', 'task'] });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'task'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    this.logger.log(`Mise à jour du commentaire ${id}`);
    const comment = await this.findOne(id);

    if (dto.taskId) {
      const task = await this.tasksRepository.findOne({
        where: { id: dto.taskId },
      });
      if (!task) {
        throw new NotFoundException(`Task with ID ${dto.taskId} not found`);
      }
      comment.task = task;
    }

    if (dto.authorId) {
      const author = await this.usersRepository.findOne({
        where: { id: dto.authorId },
      });
      if (!author) {
        throw new NotFoundException(`User with ID ${dto.authorId} not found`);
      }
      comment.author = author;
    }

    Object.assign(comment, {
      content: dto.content ?? comment.content,
    });

    return this.commentsRepository.save(comment);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Suppression du commentaire ${id}`);
    const comment = await this.findOne(id);
    await this.commentsRepository.remove(comment);
  }
}
