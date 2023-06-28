import { HttpException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotificationStatus } from './notification-status.enum';
import { NotificationRepository } from './notification.repository';
import { PostRepository } from '../posts/post.repository';
import { UserRepository } from '../auth/user.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async postNotification(
    postId: number,
    notificationContent: string,
    reporterId: number,
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const notification =
        await this.notificationRepository.findOneNotification(
          postId,
          reporterId,
        );
      const reportedId = await this.postRepository.findReportedId(postId);
      const movieId = await this.postRepository.findMovieId(postId);

      await queryRunner.commitTransaction();

      if (!notification) {
        await this.notificationRepository.createNotification(
          postId,
          notificationContent,
          reporterId,
          reportedId,
          movieId,
        );
        return '해당 게시물의 신고가 완료되었습니다.';
      } else {
        return '해당 게시물 신고 이력이 존재합니다.';
      }
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('해당 게시물 신고에 실패하였습니다.', 400);
    } finally {
      await queryRunner.release();
    }
  }

  async cancelNotification(
    postId: number,
    reporterId: number,
  ): Promise<string> {
    try {
      const notification =
        await this.notificationRepository.findOneNotification(
          postId,
          reporterId,
        );

      if (notification && notification.status === 'AWAIT') {
        await this.notificationRepository.cancelNotification(
          postId,
          reporterId,
        );

        return '해당 게시물의 신고 취소가 완료되었습니다.';
      } else if (notification && notification.status === 'ACCEPT') {
        return '해당 게시물의 신고 처리가 완료되어 신고 취소를 할 수 없습니다.';
      } else if (!notification) {
        return '해당 게시물의 신고 내역을 찾을 수 없습니다.';
      }
    } catch (error) {
      throw new HttpException('신고 취소에 실패하였습니다.', 400);
    }
  }

  async getReporterNotification(reporterId: number) {
    try {
      return await this.notificationRepository.getReporterNotification(
        reporterId,
      );
    } catch (error) {
      throw new HttpException('신고 목록 조회에 실패하였습니다.', 400);
    }
  }

  async getReportedNotification(reportedId: number) {
    try {
      return await this.notificationRepository.getReportedNotification(
        reportedId,
      );
    } catch (error) {
      throw new HttpException('신고 당한 목록 조회에 실패하였습니다.', 400);
    }
  }

  async getAllNotification(auth: string) {
    try {
      if (auth === 'admin') {
        return await this.notificationRepository.getAllNotification();
      } else {
        return '신고 목록 전체 조회 권한이 없습니다.';
      }
    } catch (error) {
      throw new HttpException('전체 신고 목록 조회에 실패했습니다.', 400);
    }
  }

  async acceptNotification(
    auth: string,
    notiId: number,
    status: NotificationStatus,
    period: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      if (auth === 'admin' && status === 'ACCEPT') {
        const userId =
          await this.notificationRepository.findOneNotificationBynotiId(notiId);

        await this.notificationRepository.updateStatusNotification(
          notiId,
          status,
        );
        await this.userRepository.incrementUserBanCount(userId);
        if (period === -1) {
          // 영구 정지
          await this.userRepository.update(userId, { isBanned: true });
        } else {
          // 기간 정지
          await this.userRepository.update(userId, {
            limitedAt: this.calcLimitPeriod(period),
          });
        }
        await queryRunner.commitTransaction();

        return '관리자 권한으로 신고 승인이 완료되었습니다.';
      } else {
        await queryRunner.rollbackTransaction();
        return '신고 승인 권한이 없습니다.';
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('신고 승인 처리에 실패했습니다.', 400);
    } finally {
      await queryRunner.release();
    }
  }

  calcLimitPeriod(period: number): Date {
    // 하루 단위 * 입력받은 숫자로 제한 시간을 만든다.
    const suspensionPeriod = 24 * 60 * 60 * 1000 * period;

    const currentDate = new Date(); // 현재 시간
    const suspendedUntil = new Date(currentDate.getTime() + suspensionPeriod);
    // const suspendedUntil = new Date(currentDate.getTime());
    return suspendedUntil;
  }

  async rejectNotification(
    auth: string,
    notiId: number,
    status: NotificationStatus,
  ) {
    try {
      if (auth === 'admin' && status === 'REJECT') {
        await this.notificationRepository.updateStatusNotification(
          notiId,
          status,
        );

        return '관리자 권한으로 신고 반려가 완료되었습니다.';
      } else {
        return '신고 반려 권한이 없습니다.';
      }
    } catch (error) {
      throw new HttpException('신고 반려 처리에 실패했습니다.', 400);
    }
  }
}
