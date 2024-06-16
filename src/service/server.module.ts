import { Module } from '@nestjs/common';

import { ServerController } from './server.controller';
import { ServerRepository } from './server.repository';
import { ServerService } from './server.service';

@Module({
  imports: [],
  providers: [ServerService, ServerRepository],
  controllers: [ServerController],
})
export class ServerModule {}
