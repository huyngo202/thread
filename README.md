# ThreadHUS

ThreadHUS is a modern social media application inspired by platforms like Twitter/X, enhanced with powerful features to help users create engaging threads effortlessly.

## Features

### Core Social Features
- **CRUD Posts/Threads:** Users can create, read, update, and delete posts.
- **User Authentication:** Secure signup and login powered by Supabase Auth.
- **Real-time Feed:** Live updates of posts with interactive UI.
- **Post Interactions:** Like, reply, and retweet functionality.
- **Thread Conversations:** Support for nested replies forming threaded conversations.
### Advancetices Features
- **Sentiment Analysis:** Automatic detection of positive, neutral, or negative sentiment in posts.
- **Smart Reply Suggestions:** Generated context-aware reply suggestions.
- **Auto Hashtag Suggestions:** Relevant hashtags recommended by AI based on post content.
- **Thread Summarization:** Summarize long threads to highlight key points.
- **Engagement Analytics:** Real-time insights into user engagement and trending topics.
- **Optimal Posting Times:** Recommendations on the best times to post for maximum engagement.

## Technologies Used
- **Frontend & Backend:** Next.js with TypeScript
- **Authentication & Database:** Supabase (PostgreSQL + Auth)
- **Styling:** Tailwind CSS for modern responsive UI
- **Real-time updates:** Supabase real-time subscriptions

## Design Highlights
- Clean, minimalist interface inspired by modern social platforms
- Responsive card-based layout with smooth animations and micro-interactions
- Professional color palette featuring blues and grays for a sleek look

## Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase project with Auth and database configured

### Setup
1. Clone the repo
   ```bash
   git clone https://github.com/huyngo202/thread.git
   cd thread
2. Install dependencies
    ```
    npm install
    Configure environment variables
3. Create .env.local file with your Supabase credentials, for example:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

3. Run the development server
    ```
    npm run dev