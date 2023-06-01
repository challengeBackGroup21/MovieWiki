import { Controller, Param, Patch, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LikeService } from 'src/likes/likes.service';
import { AccessTokenGuard } from 'src/auth/guards';
import { GetCurrentUser } from 'src/auth/common/decorators/get-current-user.decorator';

@Controller('movie')
@UseGuards(AccessTokenGuard)
export class LikesController {
    constructor(
        private readonly likeService: LikeService,
    ) { }

    // @Patch 데코레이터를 사용하여 updateLike 메서드를 PATCH 요청에 매핑
    @Patch('/:movieId/like')
    async updateLike(
        @Param('movieId', ParseIntPipe) movieId: number,
        @GetCurrentUser() user
    ) {
        const userId = user.userId;

        return this.likeService.updateLike(movieId, userId);
    }
}
