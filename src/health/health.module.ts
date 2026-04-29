import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TerminusModule, TypeOrmModule.forFeature([User])],
  controllers: [HealthController],
})
export class HealthModule {}
