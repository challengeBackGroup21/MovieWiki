import { Post } from '../post.entity';

// ProcessedPost type
export type ProcessedPost = Pick<
  Post,
  'postId' | 'content' | 'version'
>;
