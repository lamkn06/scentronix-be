import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';

import { ServerRepository } from './server.repository';

@Injectable()
export class ServerService {
  private readonly logger = new Logger(ServerService.name);

  constructor(private readonly serverRepository: ServerRepository) {}

  async findServer() {
    try {
      const servers = await this.serverRepository.find();
      for (const server of servers) {
        if (await this.checkServerAvailability(server.url)) {
          return server;
        }
      }

      throw new NotFoundException('No online servers found.');
    } catch (error) {
      throw new NotFoundException('No online servers found.');
    }
  }

  private async checkServerAvailability(url: string): Promise<boolean> {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      return response.status >= 200 && response.status <= 299;
    } catch (error) {
      return false;
    }
  }
}
