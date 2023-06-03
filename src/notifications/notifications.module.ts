import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationRepository } from './notification.repository';
import { PostRepository } from '../posts/post.repository';
import { UserRepository } from '../auth/user.repository';
import { Notification } from './notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository, PostRepository, UserRepository],
  exports: [NotificationsService, NotificationRepository, PostRepository, UserRepository],
})
export class NotificationsModule {}