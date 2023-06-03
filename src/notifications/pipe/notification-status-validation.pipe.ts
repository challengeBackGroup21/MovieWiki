import { HttpException, PipeTransform } from '@nestjs/common';
import { NotificationStatus } from '../notification-status.enum';

export class NotificationStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [
    NotificationStatus.AWAIT,
    NotificationStatus.ACCEPT,
    NotificationStatus.REJECT,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new HttpException(`${value} 올바른 옵션이 아닙니다.`, 401);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
