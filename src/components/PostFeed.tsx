
import React from 'react';
import { PostCard } from './PostCard';
import { Post } from '@/pages/Index';

interface PostFeedProps {
  posts: Post[];
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  currentUserId?: string;
}

export const PostFeed: React.FC<PostFeedProps> = ({ posts, onLike, onDelete, currentUserId }) => {
  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No posts yet</div>
          <div className="text-gray-400 text-sm">Be the first to share something!</div>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={onLike}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        ))
      )}
    </div>
  );
};
