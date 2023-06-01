import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikeService } from './likes.service';
import { LikeRepository } from './like.repository';

@Module({
  controllers: [LikesController],
  providers: [LikeService, LikeRepository]
})
export class LikesModule {}
