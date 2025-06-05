
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Trash2, Sparkles } from 'lucide-react';
import { Post } from '@/pages/Index';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AIReplySuggestions } from './AIReplySuggestions';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  currentUserId?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete, currentUserId }) => {
  const [showAIReplies, setShowAIReplies] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      onLike(post.id);
      setLiked(true);
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-50 text-green-700 border-green-200';
      case 'negative': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Check if current user can delete this post
  const canDelete = currentUserId === post.user_id;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
            {post.avatar}
          </div>
          
          {/* Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.author}</h3>
                <span className="text-gray-500 text-sm">@{post.author.toLowerCase().replace(' ', '')}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 text-sm">{formatTime(post.timestamp)}</span>
                {post.sentiment && (
                  <Badge className={`text-xs ${getSentimentColor(post.sentiment)}`}>
                    {post.sentiment}
                  </Badge>
                )}
              </div>
              
              {canDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem 
                      onClick={() => onDelete(post.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            {/* Post Content */}
            <p className="text-gray-800 leading-relaxed">{post.content}</p>
            
            {/* Hashtags */}
            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.hashtags.map((hashtag, index) => (
                  <Badge key={index} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    #{hashtag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex space-x-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setShowAIReplies(!showAIReplies)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.replies}
                </Button>
                
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600 hover:bg-green-50">
                  <Repeat2 className="w-4 h-4 mr-1" />
                  {post.retweets}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-600 hover:bg-red-50`}
                  onClick={handleLike}
                >
                  <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                  {post.likes + (liked ? 1 : 0)}
                </Button>
                
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
              
              {post.aiSuggestions && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={() => setShowAIReplies(!showAIReplies)}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Replies
                </Button>
              )}
            </div>
            
            {/* AI Reply Suggestions */}
            {showAIReplies && post.aiSuggestions && (
              <AIReplySuggestions suggestions={post.aiSuggestions} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
