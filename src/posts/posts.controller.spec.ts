import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { CreatePostRecordDto } from './dto/create-post-record.dto';
import { User } from '../auth/user.entity';

describe('PostsController', () => {
  let postController: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });

  it('createPostRecord success', () => {
    // given

    const createPostRecordDto: CreatePostRecordDto = {
      content: '진짜 재밌음.',
      comment: 'ㅇㅇ',
      version: null,
    };
    const movieId = 1;
    const user = {
      userId: 1,
      email: 'meadd231@gmail.com',
      nickname: 'meadd231',
      auth: 'USER',
    };

    postService.createPostRecord = jest.fn().mockImplementation(() => {
      return '하하';
    });

    // when
    const result = postController.createPostRecord(
      createPostRecordDto,
      movieId,
      user,
    );

    // then
    expect(result).toEqual('하하');
    expect(postService.createPostRecord).toHaveBeenCalledTimes(1);
  });

  it('getPostRecords success', () => {
    // given
    postService.getPostRecords = jest.fn().mockImplementation(() => {
      return [];
    });
    const movieId = 1;
    // when
    const result = postController.getPostRecords(movieId);

    // then
    expect(result).toEqual([]);
    expect(postService.getPostRecords).toHaveBeenCalledTimes(1);
  });
});
