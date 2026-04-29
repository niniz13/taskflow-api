import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    this.logger.log(`Création d'un projet : ${dto.name}`);

    let team: Team | undefined;
    if (dto.teamId) {
      team =
        (await this.teamsRepository.findOne({ where: { id: dto.teamId } })) ??
        undefined;
      if (!team) {
        throw new NotFoundException(`Team with ID ${dto.teamId} not found`);
      }
    }

    const project = this.projectsRepository.create({
      name: dto.name,
      description: dto.description,
      status: dto.status,
      team,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({ relations: ['team', 'tasks'] });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['team', 'tasks'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    this.logger.log(`Mise à jour du projet ${id}`);

    const project = await this.findOne(id);

    if (dto.teamId) {
      const team = await this.teamsRepository.findOne({
        where: { id: dto.teamId },
      });
      if (!team) {
        throw new NotFoundException(`Team with ID ${dto.teamId} not found`);
      }
      project.team = team;
    }

    Object.assign(project, {
      name: dto.name ?? project.name,
      description: dto.description ?? project.description,
      status: dto.status ?? project.status,
      updatedAt: new Date(),
    });

    return this.projectsRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Suppression du projet ${id}`);
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }
}
