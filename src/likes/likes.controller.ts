import { Controller, Param, Patch, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { PostService } from './post.service';
import { LikeService } from 'src/likes/likes.service';
import { User } from 'src/auth/user.entity';
// import { GetUser } from '../auth/get-user.decorator';

@Controller('movie')
// @UseGuards(AuthGuard()) 데코레이터를 사용하여 해당 엔드포인트에 인증 가드를 적용
@UseGuards(AuthGuard())
export class LikesController {
    constructor(
        private readonly likeService: LikeService,
    ) { }

    // @Patch 데코레이터를 사용하여 updateLike 메서드를 PATCH 요청에 매핑
    @Patch('/:movieId/like')
    async updateLike(
        @Param('movieId', ParseIntPipe) movieId: number,
        @GetUser() user: User,
    ) {
        const userId = user.userId;

        return this.likeService.updateLike(movieId, userId);
    }
}
