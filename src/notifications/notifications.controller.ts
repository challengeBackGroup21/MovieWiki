import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Body,
} from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/notification.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { NotificationStatus } from './notification-status.enum';
import { NotificationStatusValidationPipe } from './pipe/notification-status-validation.pipe';

@Controller('notifications')
@UseGuards(AuthGuard())
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // 신고하기
  @Post('/:postId')
  async postNotification(
    @Body() body,
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser() user: User,
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
    @GetUser() user: User,
  ): Promise<string> {
    const reporterId = user.userId;

    return await this.notificationsService.cancelNotification(
      postId,
      reporterId,
    );
  }

  // 로그인 한 유저가 신고한 목록 조회
  @Get('/:reporterId')
  async getReporterNotification(
    @Param('reporterId', ParseIntPipe) reporterId: number,
  ): Promise<Notification[] | any> {
    return await this.notificationsService.getReporterNotification(reporterId);
  }

  // 로그인 한 유저가 신고당한 목록 조회
  @Get('/:reportedId')
  async getReportedNotification(
    @Param('reportedId', ParseIntPipe) reportedId: number,
  ): Promise<Notification[] | any> {
    return await this.notificationsService.getReportedNotification(reportedId);
  }

  // 전체신고조회(어드민 계정만)
  @Get()
  async getAllNotification(
    @GetUser() user: User,
  ): Promise<Notification[] | any> {
    const auth = user.auth;

    return await this.notificationsService.getAllNotification(auth);
  }

  // 신고 접수(어드민 계정만)
  @Patch(':notiId/accept')
  async acceptNotification(
    @Param('notiId', ParseIntPipe) notiId: number,
    @GetUser() user: User,
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
    @GetUser() user: User,
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
