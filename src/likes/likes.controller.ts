import {
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/common/decorators';
import { AccessTokenGuard } from '../auth/guards';
// import { PostService } from './post.service';
import { User } from '../auth/user.entity';
import { LikeService } from '../likes/likes.service';
// import { GetUser } from '../auth/get-user.decorator';

@Controller('movie')
export class LikesController {
  constructor(private readonly likeService: LikeService) {}

  // @Patch 데코레이터를 사용하여 updateLike 메서드를 PATCH 요청에 매핑
  @Patch('/:movieId/like')
  @UseGuards(AccessTokenGuard)
  async updateLike(
    @Param('movieId', ParseIntPipe) movieId: number,
    @GetCurrentUser() user: User,
  ) {
    const userId = user.userId;

    return this.likeService.updateLike(movieId, userId);
  }
}
