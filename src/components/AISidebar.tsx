
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Brain, Hash, Users, Lightbulb, Target, Clock } from 'lucide-react';
import { Post } from '@/pages/Index';

interface AISidebarProps {
  posts: Post[];
}

export const AISidebar: React.FC<AISidebarProps> = ({ posts }) => {
  // AI-powered analytics
  const getTrendingHashtags = () => {
    const hashtagCount: { [key: string]: number } = {};
    posts.forEach(post => {
      post.hashtags.forEach(hashtag => {
        hashtagCount[hashtag] = (hashtagCount[hashtag] || 0) + 1;
      });
    });
    
    return Object.entries(hashtagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([hashtag, count]) => ({ hashtag, count }));
  };

  const getSentimentAnalysis = () => {
    const sentiments = posts.map(post => post.sentiment).filter(Boolean);
    const positive = sentiments.filter(s => s === 'positive').length;
    const negative = sentiments.filter(s => s === 'negative').length;
    const neutral = sentiments.filter(s => s === 'neutral').length;
    const total = sentiments.length;
    
    return {
      positive: total > 0 ? Math.round((positive / total) * 100) : 0,
      negative: total > 0 ? Math.round((negative / total) * 100) : 0,
      neutral: total > 0 ? Math.round((neutral / total) * 100) : 0,
      total
    };
  };

  const getEngagementInsights = () => {
    if (posts.length === 0) return null;
    
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalReplies = posts.reduce((sum, post) => sum + post.replies, 0);
    const totalRetweets = posts.reduce((sum, post) => sum + post.retweets, 0);
    const avgLikes = Math.round(totalLikes / posts.length);
    const avgReplies = Math.round(totalReplies / posts.length);
    const avgRetweets = Math.round(totalRetweets / posts.length);
    
    // Find best performing post
    const bestPost = posts.reduce((best, current) => 
      (current.likes + current.replies + current.retweets) > (best.likes + best.replies + best.retweets) 
        ? current 
        : best
    , posts[0]);
    
    return { 
      avgLikes, 
      avgReplies, 
      avgRetweets,
      totalPosts: posts.length,
      bestPost
    };
  };

  const getAIRecommendations = () => {
    const sentiment = getSentimentAnalysis();
    const engagement = getEngagementInsights();
    const trending = getTrendingHashtags();
    
    const recommendations = [];
    
    if (sentiment.positive < 30) {
      recommendations.push({
        icon: '😊',
        title: 'Boost Positivity',
        description: 'Share more uplifting content to increase positive engagement'
      });
    }
    
    if (engagement && engagement.avgLikes < 2) {
      recommendations.push({
        icon: '❤️',
        title: 'Increase Engagement',
        description: 'Try asking questions or sharing personal experiences'
      });
    }
    
    if (trending.length > 0) {
      recommendations.push({
        icon: '#️⃣',
        title: 'Use Trending Tags',
        description: `Consider using #${trending[0].hashtag} in your next post`
      });
    }
    
    if (posts.length > 0) {
      const recentPosts = posts.slice(0, 5);
      const hasVariety = new Set(recentPosts.map(p => p.sentiment)).size > 1;
      
      if (!hasVariety) {
        recommendations.push({
          icon: '🎯',
          title: 'Diversify Content',
          description: 'Mix different types of content for better reach'
        });
      }
    }
    
    return recommendations.slice(0, 3);
  };

  const getOptimalPostingTime = () => {
    if (posts.length === 0) return null;
    
    const hourCounts: { [key: number]: number } = {};
    
    posts.forEach(post => {
      const hour = post.timestamp.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + (post.likes + post.replies);
    });
    
    const bestHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (!bestHour) return null;
    
    const hour = parseInt(bestHour[0]);
    const timeString = hour === 0 ? '12:00 AM' : 
                     hour < 12 ? `${hour}:00 AM` : 
                     hour === 12 ? '12:00 PM' : 
                     `${hour - 12}:00 PM`;
    
    return timeString;
  };

  const trendingHashtags = getTrendingHashtags();
  const sentiment = getSentimentAnalysis();
  const engagement = getEngagementInsights();
  const recommendations = getAIRecommendations();
  const optimalTime = getOptimalPostingTime();

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <Brain className="w-5 h-5" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-purple-700">
            <p className="font-medium mb-2">Community Mood ({sentiment.total} posts analyzed):</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Positive</span>
                <span className="font-semibold">{sentiment.positive}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${sentiment.positive}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between">
                <span>Neutral</span>
                <span className="font-semibold">{sentiment.neutral}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-gray-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${sentiment.neutral}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between">
                <span>Negative</span>
                <span className="font-semibold">{sentiment.negative}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${sentiment.negative}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Lightbulb className="w-5 h-5" />
              <span>AI Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-orange-100">
                <span className="text-lg">{rec.icon}</span>
                <div>
                  <p className="font-medium text-orange-800 text-sm">{rec.title}</p>
                  <p className="text-orange-600 text-xs">{rec.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Trending Hashtags */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-blue-600" />
            <span>Trending Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendingHashtags.length > 0 ? (
            <div className="space-y-3">
              {trendingHashtags.map(({ hashtag, count }, index) => (
                <div key={hashtag} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      #{hashtag}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{count} posts</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No trending hashtags yet</p>
          )}
        </CardContent>
      </Card>

      {/* Engagement Stats */}
      {engagement && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Engagement Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-lg font-bold text-gray-700">{engagement.totalPosts}</div>
                <div className="text-xs text-gray-500">Total Posts</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">{engagement.avgLikes}</div>
                <div className="text-xs text-gray-500">Avg. Likes</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">{engagement.avgReplies}</div>
                <div className="text-xs text-gray-500">Avg. Replies</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{engagement.avgRetweets}</div>
                <div className="text-xs text-gray-500">Avg. Retweets</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimal Posting Time */}
      {optimalTime && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-indigo-800">
              <Clock className="w-5 h-5" />
              <span>Optimal Timing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-700">{optimalTime}</div>
              <p className="text-sm text-indigo-600 mt-1">
                Best time to post based on your engagement data
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Writing Tips */}
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-cyan-800">
            <Target className="w-5 h-5" />
            <span>Smart Writing Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-cyan-700">
            <p>💡 <strong>Question Power:</strong> Posts with questions get 40% more replies</p>
            <p>🎯 <strong>Hashtag Sweet Spot:</strong> 2-3 hashtags perform best</p>
            <p>😊 <strong>Emotion Wins:</strong> Emotional posts get 2x more engagement</p>
            <p>📸 <strong>Visual Appeal:</strong> Posts with emojis get 25% more likes</p>
            <p>⏰ <strong>Timing Matters:</strong> Consistency beats frequency</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
