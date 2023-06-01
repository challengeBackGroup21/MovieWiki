import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './Notification.entity';
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

    async findReportedId(postId: number) {
        const notificationPost = await this.notificationRepository.findOne({
            where: { postId }
        });

        return notificationPost.reportedId;
    };

    async createNotification(
        postId: number,
        notificationContent: string,
        reporterId: number,
        reportedId: number
    ) {
        const notification = this.notificationRepository.create({
            postId,
            notificationContent,
            reporterId,
            reportedId
        });
        return this.notificationRepository.save(notification);
    };

    async cancelNotification(
        postId: number,
        reporterId: number
    ) {
        await this.notificationRepository.delete({ postId, reporterId });
    };

    async getReporterNotification(reporterId: number) {
        const notificationPost = await this.notificationRepository.findOne({
            where: { reporterId }
        });

        return notificationPost
    };

    async getReportedNotification(reportedId: number) {
        const notificationPost = await this.notificationRepository.findOne({
            where: { reportedId }
        });

        return notificationPost
    };

    async getAllNotification() {
        return await this.notificationRepository.find();
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
};