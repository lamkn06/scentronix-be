import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { ServerRepository } from './server.repository';
import { ServerService } from './server.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ServerService', () => {
  let service: ServerService;
  let repository: ServerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerService, ServerRepository],
    }).compile();

    service = module.get<ServerService>(ServerService);
    repository = module.get<ServerRepository>(ServerRepository);

    jest.spyOn(repository, 'find').mockImplementation(async () => [
      { url: 'https://online.server.com', priority: 1 },
      { url: 'https://offline.server.com', priority: 2 },
    ]);

    // Reset mocks before each test
    mockedAxios.get.mockReset();
  });

  it('should find an online server', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url === 'https://online.server.com') {
        return Promise.resolve({ status: 200 });
      }
      return Promise.reject(new Error('Server not reachable'));
    });

    const result = await service.findServer();
    expect(result).toEqual([
      { online: true, priority: 1, url: 'https://online.server.com' },
      { online: false, priority: 2, url: 'https://offline.server.com' },
    ]);
  });

  it('should throw NotFoundException if no servers are online', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Server not reachable'));

    await expect(service.findServer()).rejects.toThrow(
      'No online servers found.',
    );
  });
});
