import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './likes.service';

describe('LikeService', () => {
  let likeService: LikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeService],
    }).compile();

    likeService = module.get<LikeService>(LikeService);
  });

  it('should be defined', () => {
    expect(likeService).toBeDefined();
  });

  it('updateLike success', () => {
    // given
    // when
    // then
  });
});
