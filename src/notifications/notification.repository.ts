import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationStatus } from './notification-status.enum';


@Injectable()
export class NotificationRepository {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>
    ) { }

    async findOneNotification(postId: number, reporterId: number) {
        return this.notificationRepository.findOne({
            where: { postId, reporterId }
        });
    };

    async createNotification(
        postId: number,
        notificationContent: string,
        reporterId: number,
        reportedId: number,
        movieId: number
    ) {
        const notification = new Notification()
        notification.postId = postId,
        notification.notificationContent = notificationContent,
        notification.reporterId = reporterId,
        notification.reportedId = reportedId,
        notification.movieId = movieId

        return this.notificationRepository.save(notification);
    };

    async cancelNotification(
        postId: number,
        reporterId: number
    ) {
        await this.notificationRepository.delete({ postId, reporterId });
    };

    async getReporterNotification(reporterId: number) {
        const notificationPost = await this.notificationRepository.find({
            where: { reporterId },
            order: { notiId: 'ASC'}
        });

        return notificationPost
    };

    async getReportedNotification(reportedId: number) {
        const notificationPost = await this.notificationRepository.find({
            where: { reportedId },
            order: { notiId: 'ASC'}
        });

        return notificationPost
    };

    async getAllNotification() {
        return await this.notificationRepository.find({
            order: { notiId: 'ASC'}
        });
    };

    async updateStatusNotification(
        notiId: number,
        status: NotificationStatus
    ) {
        return await this.notificationRepository.update(
            { notiId: notiId},
            { status: status },
        );
    };

    async findOneNotificationBynotiId(notiId: number) {
        const result =  await this.notificationRepository.findOne({
            where: {notiId}
        });

        return result.reportedId
    };
};