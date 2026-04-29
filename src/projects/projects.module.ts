import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Team } from 'src/teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Team])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
