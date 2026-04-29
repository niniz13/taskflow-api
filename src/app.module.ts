import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { HealthModule } from './health/health.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guard/roles.guard';

@Module({
  imports: [
    // Chargement de la configuration depuis .env
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,  // Rendre le ConfigService disponible globalement
    }),

    // Configuration de TypeORM avec les paramètres de la base de données
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        database: config.get<string>('DB_NAME', 'taskflow'),
        username: config.get<string>('DB_USER', 'taskflow'),
        password: config.get<string>('DB_PASSWORD', 'taskflow'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),

    // Import des modules de l'application
    UsersModule,
    TeamsModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
