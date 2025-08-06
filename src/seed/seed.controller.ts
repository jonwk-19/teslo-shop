import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';


@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Execute database seeding',
    description: 'Deletes current users/products and inserts predefined data. Should only be used in development or testing.',
  })
  @ApiResponse({
    status: 200,
    description: 'Seed executed successfully',
    schema: {
      example: 'SEED EXECUTED',
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires admin access.' })
  // @Auth()
  runSeed() {
    return this.seedService.runSeed();
  }

}
