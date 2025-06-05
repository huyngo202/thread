
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Send, RefreshCw, ThumbsUp, MessageCircle } from 'lucide-react';

interface AIReplySuggestionsProps {
  suggestions: string[];
}

export const AIReplySuggestions: React.FC<AIReplySuggestionsProps> = ({ suggestions }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const handleUseSuggestion = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    console.log('Using AI suggestion:', suggestion);
    // In a real app, this would populate a reply composer
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    // Simulate regeneration delay
    setTimeout(() => {
      setRegenerating(false);
    }, 1000);
  };

  const getSuggestionIcon = (index: number) => {
    switch (index) {
      case 0: return <ThumbsUp className="w-3 h-3" />;
      case 1: return <MessageCircle className="w-3 h-3" />;
      default: return <Send className="w-3 h-3" />;
    }
  };

  const getSuggestionStyle = (index: number) => {
    const styles = [
      "border-green-200 hover:bg-green-50 text-green-700",
      "border-blue-200 hover:bg-blue-50 text-blue-700",
      "border-purple-200 hover:bg-purple-50 text-purple-700"
    ];
    return styles[index] || "border-gray-200 hover:bg-gray-50 text-gray-700";
  };

  return (
    <Card className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">AI-Powered Reply Suggestions</span>
          </div>
          <Button 
            size="sm" 
            variant="ghost"
            className="text-purple-600 hover:bg-purple-100 h-6 px-2"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            <RefreshCw className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 bg-white rounded-lg border transition-all duration-200 ${
                selectedSuggestion === suggestion 
                  ? 'ring-2 ring-purple-300 border-purple-300' 
                  : getSuggestionStyle(index)
              }`}
            >
              <span className="text-gray-700 flex-1 text-sm">{suggestion}</span>
              <Button 
                size="sm" 
                variant="outline"
                className={`ml-3 h-7 px-3 text-xs transition-colors ${
                  selectedSuggestion === suggestion
                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                    : 'text-purple-600 border-purple-200 hover:bg-purple-50'
                }`}
                onClick={() => handleUseSuggestion(suggestion)}
              >
                {getSuggestionIcon(index)}
                <span className="ml-1">
                  {selectedSuggestion === suggestion ? 'Selected' : 'Use'}
                </span>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-2 bg-purple-100 rounded-lg">
          <p className="text-xs text-purple-700 flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            These replies are tailored to the post's tone and sentiment to help you engage authentically
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
