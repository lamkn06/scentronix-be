import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ServerService } from './server.service';

@ApiTags('Servers')
@Controller('servers')
export class ServerController {
  constructor(private readonly service: ServerService) {}

  @Get()
  @ApiOperation({ summary: 'Get Server' })
  async find() {
    return this.service.findServer();
  }
}
