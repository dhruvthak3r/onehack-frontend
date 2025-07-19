import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchFilters } from "@/components/SearchFilters";
import { HackathonCard } from "@/components/HackathonCard";
import { EmptyState } from "@/components/EmptyState";
import { useHackathons } from "@/hooks/useHackathons";
import { useBookmarks } from "@/hooks/useBookmarks";
import { FilterState } from "@/types/hackathon";
import { Loader2, Sparkles } from "lucide-react";

const Index = () => {
  const { hackathons, loading, error, searchHackathons, filterHackathons } = useHackathons();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const [filters, setFilters] = useState<FilterState>({
    platforms: [],
    dateRange: {},
    location: "all",
    search: ""
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    filterHackathons(newFilters);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchHackathons(query);
    } else {
      filterHackathons(filters);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-8">
          <EmptyState
            type="error"
            title="Something went wrong"
            description={error}
            action={{
              label: "Try Again",
              onClick: () => window.location.reload()
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Discover Amazing Hackathons
            </h1>
            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find and participate in the best hackathons from top platforms. 
            Build, learn, and win amazing prizes!
          </p>
        </div>

        {/* Search & Filters */}
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          className="max-w-4xl mx-auto mb-8"
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading hackathons...</span>
            </div>
          </div>
        )}

        {/* Hackathons Grid */}
        {!loading && hackathons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {hackathons.map((hackathon, index) => (
              <div
                key={`${hackathon.title}-${hackathon.startDate}`}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <HackathonCard
                  hackathon={hackathon}
                  isBookmarked={isBookmarked(hackathon)}
                  onBookmarkToggle={toggleBookmark}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && hackathons.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <EmptyState
              type="search"
              title="No hackathons found"
              description="Try adjusting your search terms or filters to discover more hackathons."
              action={{
                label: "Clear Filters",
                onClick: () => {
                  const clearedFilters: FilterState = {
                    platforms: [],
                    dateRange: {},
                    location: "all",
                    search: ""
                  };
                  setFilters(clearedFilters);
                  filterHackathons(clearedFilters);
                }
              }}
            />
          </div>
        )}

        {/* Stats Footer */}
        {!loading && hackathons.length > 0 && (
          <div className="text-center mt-12 p-6 rounded-xl bg-gradient-glow border border-border/50">
            <p className="text-muted-foreground">
              Showing <span className="text-accent font-semibold">{hackathons.length}</span> hackathons
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
