import { Test, TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';

describe('LikesController', () => {
  let likeController: LikesController;
  let likeService: LikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
    }).compile();

    likeController = module.get<LikesController>(LikesController);
    likeService = module.get<LikeService>(LikeService);
  });

  it('should be defined', () => {
    expect(likeController).toBeDefined();
  });

  it('updateLike success', () => {
    // given
    const movieId = 1;
    const user = {
      userId: 1,
      email: 'meadd231@gmail.com',
      nickname: 'meadd231',
      auth: 'USER',
    };

    likeService.updateLike = jest.fn().mockReturnValue(() => {
      return '';
    });

    // when
    likeController.updateLike(movieId, user);

    // then
    expect(likeService.updateLike).toHaveBeenCalledTimes(1);
  });
});
