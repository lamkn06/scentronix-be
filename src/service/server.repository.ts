import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerRepository {
  async find(): Promise<{ url: string; priority: number }[]> {
    const list = [
      {
        url: 'https://does-not-work.perfume.new',
        priority: 1,
      },
      {
        url: 'https://gitlab.com',
        priority: 4,
      },
      {
        url: 'http://app.scnt.me',
        priority: 3,
      },
      {
        url: 'https://offline.scentronix.com',
        priority: 2,
      },
    ];

    return list.sort((a, b) => a.priority - b.priority);
  }
}
