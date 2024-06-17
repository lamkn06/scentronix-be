import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';

import { Server } from './interfaces/server.interface';
import { ServerRepository } from './server.repository';

@Injectable()
export class ServerService {
  private readonly logger = new Logger(ServerService.name);

  constructor(private readonly serverRepository: ServerRepository) {}

  async findServer(): Promise<Server[]> {
    try {
      const servers = [];
      const response = await this.serverRepository.find();

      for (const server of response) {
        servers.push({
          url: server.url,
          priority: server.priority,
          online: await this.checkServerAvailability(server.url),
        });
      }

      if (servers.length === 0) {
        throw new NotFoundException('No online servers found.');
      }

      const offlineServers = servers.filter((server) => !server.online);
      if (offlineServers.length === servers.length) {
        throw new NotFoundException('No online servers found.');
      }

      return servers.sort((a, b) => a.priority - b.priority);
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
