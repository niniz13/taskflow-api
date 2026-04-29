import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find({ relations: ['members'] });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['members', 'projects'],
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async create(dto: CreateTeamDto): Promise<Team> {
    const team = this.teamsRepository.create({
      name: dto.name,
      description: dto.description,
    });
    return this.teamsRepository.save(team);
  }

  async update(id: string, dto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, dto, { updatedAt: new Date() });
    return this.teamsRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    await this.teamsRepository.remove(team);
  }

  async addMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
      relations: ['members'],
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (team.members.some((member) => member.id === userId)) {
      throw new ConflictException(
        `User with ID ${userId} is already a member of team ${teamId}`,
      );
    }
    team.members.push(user);
    return this.teamsRepository.save(team);
  }

  async removeMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
      relations: ['members'],
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    team.members = team.members.filter((member) => member.id !== userId);
    return this.teamsRepository.save(team);
  }
}
