import { Controller, Get, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Health')
@ApiBearerAuth('JWT-auth')
@Controller({
  version: '1',
  path: 'health',
})
export class HealthControllerV1 {
  private readonly logger = new Logger(HealthControllerV1.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'Check API and database health' })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        version: { type: 'string', example: 'v1' },
        timestamp: { type: 'string', example: '2023-06-01T12:00:00.000Z' },
        database: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable - database connection failed',
  })
  async check() {
    // Check database connection
    let databaseConnected = false;
    try {
      databaseConnected = this.dataSource.isInitialized;
      if (databaseConnected) {
        // Run a simple query to verify connection is working
        await this.dataSource.query('SELECT 1');
      }
    } catch (error) {
      this.logger.error('Database connection failed:', error);
      databaseConnected = false;
    }

    return {
      status: databaseConnected ? 'ok' : 'degraded',
      version: 'v1',
      timestamp: new Date().toISOString(),
      database: databaseConnected,
    };
  }
}
