import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/common/decorators';
import { AccessTokenGuard } from '../auth/guards';
import { User } from '../auth/user.entity';
import { Notification } from './notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationStatus } from './notification-status.enum';
import { NotificationStatusValidationPipe } from './pipe/notification-status-validation.pipe';

@Controller('notifications')
@UseGuards(AccessTokenGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // 신고하기
  @Post('/:postId')
  async postNotification(
    @Body() body,
    @Param('postId', ParseIntPipe) postId: number,
    @GetCurrentUser() user: User,
  ): Promise<any> {
    const reporterId = user.userId;
    const notificationContent = body.notificationContent;

    return await this.notificationsService.postNotification(
      postId,
      notificationContent,
      reporterId,
    );
  }

  // 신고 취소
  @Delete('/:postId/cancel')
  async cancelNotification(
    @Param('postId', ParseIntPipe) postId: number,
    @GetCurrentUser() user: User,
  ): Promise<string> {
    const reporterId = user.userId;

    return await this.notificationsService.cancelNotification(
      postId,
      reporterId,
    );
  }

  // 로그인 한 유저가 신고한 목록 조회
  @Get('/reporter')
  async getReporterNotification(
    @GetCurrentUser() user: User,
  ): Promise<Notification[] | any> {
    const reporterId = user.userId;

    return await this.notificationsService.getReporterNotification(reporterId);
  }

  // 로그인 한 유저가 신고당한 목록 조회
  @Get('/reported')
  async getReportedNotification(
    @GetCurrentUser() user: User,
  ): Promise<Notification[] | any> {
    const reportedId = user.userId;

    return await this.notificationsService.getReportedNotification(reportedId);
  }

  // 전체신고조회(어드민 계정만)
  @Get()
  async getAllNotification(
    @GetCurrentUser() user: User,
  ): Promise<Notification[] | any> {
    const auth = user.auth;

    return await this.notificationsService.getAllNotification(auth);
  }

  // 신고 접수(어드민 계정만)
  @Patch(':notiId/accept')
  async acceptNotification(
    @Param('notiId', ParseIntPipe) notiId: number,
    @GetCurrentUser() user: User,
    @Body('status', NotificationStatusValidationPipe)
    status: NotificationStatus,
  ): Promise<any> {
    const auth = user.auth;
    return await this.notificationsService.acceptNotification(
      auth,
      notiId,
      status,
    );
  }

  // 신고 거부(어드민 계정만)
  @Patch(':notiId/reject')
  async rejectNotification(
    @Param('notiId', ParseIntPipe) notiId: number,
    @GetCurrentUser() user: User,
    @Body('status', NotificationStatusValidationPipe)
    status: NotificationStatus,
  ): Promise<any> {
    const auth = user.auth;

    return await this.notificationsService.rejectNotification(
      auth,
      notiId,
      status,
    );
  }
}
