import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from '@nestjs/terminus/dist/health-indicators/typeorm/typeorm.health';
import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    // TODO: return this.health.check([() => this.db.pingCheck('database')])
        return this.health.check([() => this.db.pingCheck('database')]);
  }
}
