import { Post } from '../post.entity';

// ProcessedPost type
export type ProcessedPost = Pick<
  Post,
  'postId' | 'userId' | 'comment' | 'content' | 'createdAt' | 'version'
>;
