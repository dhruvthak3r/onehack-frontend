import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { HackathonCard } from "@/components/HackathonCard";
import { EmptyState } from "@/components/EmptyState";
import { useHackathons } from "@/hooks/useHackathons";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Platform } from "@/types/hackathon";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const platformData = {
  devfolio: {
    name: "Devfolio",
    description: "India's largest hackathon platform with amazing prizes and opportunities",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    url: "https://devfolio.co"
  },
  devpost: {
    name: "DevPost",
    description: "Global hackathon platform connecting developers worldwide",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    url: "https://devpost.com"
  },
  unstop: {
    name: "Unstop",
    description: "Competitive programming and hackathon platform for students",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    url: "https://unstop.com"
  },
  dorahacks: {
    name: "DoraHacks",
    description: "Decentralized hackathon platform for Web3 and blockchain projects",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    url: "https://dorahacks.io"
  }
};

const PlatformPage = () => {
  const { platform } = useParams<{ platform: string }>();
  const { hackathons, loading, error, fetchByPlatform } = useHackathons();
  //const { isBookmarked, toggleBookmark } = useBookmarks();

  const currentPlatform = platform as Platform;
  const platformInfo = platformData[currentPlatform];

  useEffect(() => {
    if (currentPlatform && platformInfo) {
      fetchByPlatform(currentPlatform);
    }
  }, [currentPlatform, fetchByPlatform]);

  // Filter hackathons by current platform
  
  const filteredHackathons = hackathons.filter(
  h => h.platform.toLowerCase() === currentPlatform.toLowerCase()
  );

  if (!platformInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-8">
          <EmptyState
            type="error"
            title="Platform not found"
            description="The requested platform doesn't exist. Please check the URL and try again."
            action={{
              label: "Go Home",
              onClick: () => window.location.href = "/"
            }}
          />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-8">
          <EmptyState
            type="error"
            title="Failed to load hackathons"
            description={error}
            action={{
              label: "Try Again",
              onClick: () => fetchByPlatform(currentPlatform)
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
        {/* Platform Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className={`text-lg px-4 py-2 ${platformInfo.color}`}>
              {platformInfo.name}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(platformInfo.url, '_blank')}
              className="hover:bg-accent/10 hover:text-accent"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Platform
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            {platformInfo.name} Hackathons
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {platformInfo.description}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading {platformInfo.name} hackathons...</span>
            </div>
          </div>
        )}

        {/* Hackathons Grid */}
        {!loading && filteredHackathons.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Available Hackathons
              </h2>
              <Badge className={platformInfo.color}>
                {filteredHackathons.length} hackathons
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredHackathons.map((hackathon, index) => (
                <div
                  key={`${hackathon.title}-${hackathon.start_date}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <HackathonCard
                    hackathon={hackathon}
                    //isBookmarked={isBookmarked(hackathon)}
                    //onBookmarkToggle={toggleBookmark}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && filteredHackathons.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <EmptyState
              type="platform"
              title={`No ${platformInfo.name} hackathons found`}
              description={`There are currently no hackathons available on ${platformInfo.name}. Check back later for new opportunities!`}
              action={{
                label: "Explore All Hackathons",
                onClick: () => window.location.href = "/"
              }}
            />
          </div>
        )}

        {/* Platform Info Footer */}
        {!loading && filteredHackathons.length > 0 && (
          <div className="text-center mt-12 p-6 rounded-xl bg-gradient-glow border border-border/50">
            <p className="text-muted-foreground mb-2">
              Want to discover more hackathons?
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="hover:bg-accent/10 hover:border-accent/30 hover:text-accent"
            >
              View All Platforms
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlatformPage;