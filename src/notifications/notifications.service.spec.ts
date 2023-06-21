import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationRepository } from './notification.repository';
import { PostRepository } from '../posts/post.repository';
import { UserRepository } from '../auth/user.repository';
import { DataSource } from 'typeorm';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: NotificationRepository, useValue: {} },
        { provide: PostRepository, useValue: {} },
        { provide: UserRepository, useValue: {} },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
