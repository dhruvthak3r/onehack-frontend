import { Header } from "@/components/Header";
import { HackathonCard } from "@/components/HackathonCard";
import { EmptyState } from "@/components/EmptyState";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Bookmark, Heart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BookmarksPage = () => {
  const { bookmarks, toggleBookmark } = useBookmarks();

  const upcomingBookmarks = bookmarks.filter(h => new Date(h.start_date) > new Date());
  const pastBookmarks = bookmarks.filter(h => new Date(h.end_date) < new Date());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bookmark className="h-6 w-6 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Your Bookmarks
            </h1>
            <Heart className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Keep track of your favorite hackathons and never miss an opportunity to build something amazing.
          </p>
        </div>

        {/* Stats */}
        {bookmarks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            <div className="p-4 rounded-xl bg-gradient-glow border border-border/50 text-center">
              <div className="text-2xl font-bold text-accent mb-1">{bookmarks.length}</div>
              <div className="text-sm text-muted-foreground">Total Bookmarks</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-glow border border-border/50 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{upcomingBookmarks.length}</div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-glow border border-border/50 text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-1">{pastBookmarks.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        )}

        {bookmarks.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <EmptyState
              type="bookmarks"
              title="No bookmarks yet"
              description="Start exploring hackathons and bookmark the ones you're interested in. Your saved hackathons will appear here."
              action={{
                label: "Discover Hackathons",
                onClick: () => window.location.href = "/"
              }}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Hackathons */}
            {upcomingBookmarks.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Upcoming Hackathons</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {upcomingBookmarks.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingBookmarks.map((hackathon, index) => (
                    <div
                      key={`${hackathon.title}-${hackathon.start_date}`}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <HackathonCard
                        hackathon={hackathon}
                        isBookmarked={true}
                        onBookmarkToggle={toggleBookmark}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Past Hackathons */}
            {pastBookmarks.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold">Past Hackathons</h2>
                  <Badge variant="secondary">
                    {pastBookmarks.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastBookmarks.map((hackathon, index) => (
                    <div
                      key={`${hackathon.title}-${hackathon.start_date}`}
                      className="animate-fade-in opacity-60"
                      style={{ animationDelay: `${(index + upcomingBookmarks.length) * 0.1}s` }}
                    >
                      <HackathonCard
                        hackathon={hackathon}
                        isBookmarked={true}
                        onBookmarkToggle={toggleBookmark}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookmarksPage;