
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Hash, Image, Smile, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PostComposerProps {
  onSubmit: (content: string, hashtags: string[]) => void;
  loading: boolean;
}

export const PostComposer: React.FC<PostComposerProps> = ({ onSubmit, loading }) => {
  const [content, setContent] = useState('');
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const generateAdvancedHashtags = (text: string) => {
    const keywords = text.toLowerCase().split(' ');
    const suggestions = new Set<string>();
    
    // AI/Tech related
    if (keywords.some(word => ['ai', 'artificial', 'intelligence', 'machine', 'learning', 'ml', 'bot', 'algorithm'].includes(word))) {
      suggestions.add('AI');
      suggestions.add('MachineLearning');
      suggestions.add('TechInnovation');
      suggestions.add('FutureOfWork');
    }
    
    // Work/Career related
    if (keywords.some(word => ['work', 'job', 'career', 'office', 'meeting', 'project', 'team', 'manager', 'startup'].includes(word))) {
      suggestions.add('WorkLife');
      suggestions.add('Career');
      suggestions.add('Professional');
      suggestions.add('Productivity');
    }
    
    // Product/Business related
    if (keywords.some(word => ['product', 'launch', 'business', 'company', 'startup', 'entrepreneur', 'innovation'].includes(word))) {
      suggestions.add('ProductLaunch');
      suggestions.add('Startup');
      suggestions.add('Innovation');
      suggestions.add('Entrepreneurship');
    }
    
    // Learning/Education related
    if (keywords.some(word => ['learn', 'study', 'course', 'education', 'skill', 'training', 'knowledge'].includes(word))) {
      suggestions.add('Learning');
      suggestions.add('Education');
      suggestions.add('SkillDevelopment');
      suggestions.add('Growth');
    }
    
    // Health/Wellness related
    if (keywords.some(word => ['health', 'fitness', 'wellness', 'exercise', 'meditation', 'mindfulness'].includes(word))) {
      suggestions.add('Wellness');
      suggestions.add('Health');
      suggestions.add('Mindfulness');
      suggestions.add('SelfCare');
    }
    
    // Travel/Lifestyle related
    if (keywords.some(word => ['travel', 'vacation', 'trip', 'adventure', 'explore', 'journey'].includes(word))) {
      suggestions.add('Travel');
      suggestions.add('Adventure');
      suggestions.add('Lifestyle');
      suggestions.add('Wanderlust');
    }
    
    // Food related
    if (keywords.some(word => ['food', 'recipe', 'cooking', 'restaurant', 'meal', 'dinner', 'lunch'].includes(word))) {
      suggestions.add('Foodie');
      suggestions.add('Cooking');
      suggestions.add('Recipe');
      suggestions.add('Culinary');
    }
    
    // Sentiment-based hashtags
    const positiveWords = ['amazing', 'great', 'awesome', 'love', 'excellent', 'fantastic', 'wonderful', 'happy', 'excited'];
    const negativeWords = ['terrible', 'awful', 'frustrated', 'disappointed', 'sad', 'worried'];
    
    if (keywords.some(word => positiveWords.includes(word))) {
      suggestions.add('Motivation');
      suggestions.add('Positive');
      suggestions.add('Inspiration');
    }
    
    if (keywords.some(word => negativeWords.includes(word))) {
      suggestions.add('RealTalk');
      suggestions.add('Challenges');
      suggestions.add('Honest');
    }
    
    // Convert to array and limit to 4 suggestions
    setSuggestedHashtags(Array.from(suggestions).slice(0, 4));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (newContent.length > 15) {
      generateAdvancedHashtags(newContent);
    } else {
      setSuggestedHashtags([]);
    }
  };

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content, selectedHashtags);
      setContent('');
      setSuggestedHashtags([]);
      setSelectedHashtags([]);
    }
  };

  const getCharacterLimitColor = () => {
    const length = content.length;
    if (length > 250) return 'text-red-500';
    if (length > 200) return 'text-orange-500';
    return 'text-gray-500';
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            U
          </div>
          
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="What's on your mind? Share your thoughts..."
              value={content}
              onChange={handleContentChange}
              className="min-h-[120px] border-0 focus:ring-0 resize-none text-lg placeholder:text-gray-500"
              maxLength={280}
            />
            
            {/* Selected hashtags */}
            {selectedHashtags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Hash className="w-4 h-4" />
                  <span>Selected hashtags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedHashtags.map((hashtag, index) => (
                    <Badge 
                      key={index} 
                      variant="default" 
                      className="bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer transition-colors"
                      onClick={() => toggleHashtag(hashtag)}
                    >
                      #{hashtag} ✕
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* AI suggested hashtags */}
            {suggestedHashtags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-purple-600">
                  <Brain className="w-4 h-4" />
                  <span>AI suggested hashtags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedHashtags.map((hashtag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={`${
                        selectedHashtags.includes(hashtag)
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                      } cursor-pointer transition-colors`}
                      onClick={() => toggleHashtag(hashtag)}
                    >
                      #{hashtag} {selectedHashtags.includes(hashtag) ? '✓' : '+'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                  <Image className="w-4 h-4 mr-1" />
                  Media
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                  <Hash className="w-4 h-4 mr-1" />
                  Hashtag
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                  <Smile className="w-4 h-4 mr-1" />
                  Emoji
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${getCharacterLimitColor()}`}>
                  {content.length}/280
                </span>
                <Button 
                  onClick={handleSubmit}
                  disabled={!content.trim() || loading || content.length > 280}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
                >
                  {loading ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
