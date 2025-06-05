
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PostComposer } from '@/components/PostComposer';
import { PostFeed } from '@/components/PostFeed';
import { AISidebar } from '@/components/AISidebar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthPage } from '@/components/AuthPage';

export interface Post {
  id: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: Date;
  likes: number;
  replies: number;
  retweets: number;
  hashtags: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  aiSuggestions?: string[];
  user_id?: string;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setInitialLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts.",
        variant: "destructive"
      });
      return;
    }

    const formattedPosts: Post[] = data.map(post => ({
      id: post.id,
      content: post.content,
      author: post.author,
      avatar: post.avatar,
      timestamp: new Date(post.created_at),
      likes: post.likes,
      replies: post.replies,
      retweets: post.retweets,
      hashtags: post.hashtags || [],
      sentiment: post.sentiment as 'positive' | 'negative' | 'neutral' | undefined,
      aiSuggestions: post.ai_suggestions,
      user_id: post.user_id
    }));

    setPosts(formattedPosts);
  };

  // Load posts when user is authenticated
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  // AI-powered sentiment analysis
  const analyzeSentiment = (content: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['amazing', 'great', 'awesome', 'love', 'excellent', 'fantastic', 'wonderful', 'happy', 'excited', '!', '🚀', '❤️', '😊', '🎉'];
    const negativeWords = ['terrible', 'awful', 'hate', 'horrible', 'disappointed', 'angry', 'frustrated', 'sad', 'worried', '😢', '😠', '💔'];
    
    const lowerContent = content.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // AI-powered reply suggestions
  const generateAISuggestions = (content: string, sentiment: 'positive' | 'negative' | 'neutral'): string[] => {
    const suggestions = [];
    
    if (sentiment === 'positive') {
      suggestions.push(
        "That's fantastic! Thanks for sharing your positivity! 🌟",
        "Love your enthusiasm! Keep it up! 💪",
        "This brightened my day! Thank you! ☀️"
      );
    } else if (sentiment === 'negative') {
      suggestions.push(
        "I understand your frustration. Hope things get better soon! 💙",
        "Sorry to hear about this. Sending you support! 🤗",
        "Thank you for sharing. Your feelings are valid! 💛"
      );
    } else {
      suggestions.push(
        "Thanks for sharing your thoughts! 💭",
        "Interesting perspective! Tell us more! 🤔",
        "Appreciate you taking the time to post this! 👍"
      );
    }
    
    // Add content-specific suggestions
    if (content.includes('work') || content.includes('job')) {
      suggestions.push("How's your work-life balance been lately?");
    }
    if (content.includes('project') || content.includes('launch')) {
      suggestions.push("Would love to hear more about your project!");
    }
    if (content.includes('ai') || content.includes('technology')) {
      suggestions.push("The future of AI is so exciting! What are your thoughts?");
    }
    
    return suggestions.slice(0, 3);
  };

  const handleCreatePost = async (content: string, hashtags: string[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create posts.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // AI-powered sentiment analysis
    const sentiment = analyzeSentiment(content);
    
    // Generate AI suggestions based on content and sentiment
    const aiSuggestions = generateAISuggestions(content, sentiment);
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: user.id,
          content,
          author: user.email?.split('@')[0] || 'You',
          avatar: '😊',
          hashtags,
          sentiment,
          ai_suggestions: aiSuggestions,
          likes: 0,
          replies: 0,
          retweets: 0
        }
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive"
      });
      return;
    }

    // Add the new post to the local state
    const newPost: Post = {
      id: data.id,
      content: data.content,
      author: data.author,
      avatar: data.avatar,
      timestamp: new Date(data.created_at),
      likes: data.likes,
      replies: data.replies,
      retweets: data.retweets,
      hashtags: data.hashtags || [],
      sentiment: data.sentiment as 'positive' | 'negative' | 'neutral' | undefined,
      aiSuggestions: data.ai_suggestions,
      user_id: data.user_id
    };

    setPosts([newPost, ...posts]);
    
    toast({
      title: "Post created!",
      description: "Your post has been shared successfully.",
    });
  };

  const handleLikePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newLikes = post.likes + 1;

    const { error } = await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', postId);

    if (error) {
      console.error('Error updating likes:', error);
      toast({
        title: "Error",
        description: "Failed to update likes.",
        variant: "destructive"
      });
      return;
    }

    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, likes: newLikes }
        : p
    ));
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive"
      });
      return;
    }

    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: "Post deleted",
      description: "Your post has been removed.",
      variant: "destructive"
    });
  };

  // Show loading spinner during initial auth check
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <PostComposer onSubmit={handleCreatePost} loading={loading} />
            <PostFeed 
              posts={posts} 
              onLike={handleLikePost}
              onDelete={handleDeletePost}
              currentUserId={user.id}
            />
          </div>
          
          {/* AI Sidebar */}
          <div className="lg:col-span-1">
            <AISidebar posts={posts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
