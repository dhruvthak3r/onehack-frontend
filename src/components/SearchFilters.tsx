import { useState } from "react";
import { Search, Filter, X, Calendar, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Platform, FilterState } from "@/types/hackathon";

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: (query: string) => void;
  className?: string;
}

const platforms: { value: Platform; label: string; color: string }[] = [
  { value: "devfolio", label: "Devfolio", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { value: "devpost", label: "DevPost", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { value: "unstop", label: "Unstop", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { value: "dorahacks", label: "DoraHacks", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" }
];

export function SearchFilters({ filters, onFiltersChange, onSearch, className }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    //onFiltersChange({ ...filters, search: searchQuery });
  };

  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const handleLocationChange = (location: "all" | "online" | "offline") => {
    onFiltersChange({ ...filters, location });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      platforms: [],
      dateRange: {},
      location: "all",
      search: ""
    };
    setSearchQuery("");
    onFiltersChange(clearedFilters);
    onSearch("");
  };

  const hasActiveFilters = filters.platforms.length > 0 || filters.location !== "all" || filters.search;

  return (
    <div className={className}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search hackathons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-24 bg-surface border-border focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="hover:bg-accent/10 hover:text-accent"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            type="submit" 
            size="sm"
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="glass-effect mb-6 animate-fade-in">
          <CardContent className="p-4 space-y-4">
            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filters.search && (
                  <Badge variant="secondary" className="gap-1">
                    <Search className="h-3 w-3" />
                    {filters.search}
                  </Badge>
                )}
                {filters.platforms.map(platform => (
                  <Badge key={platform} className={platforms.find(p => p.value === platform)?.color}>
                    {platforms.find(p => p.value === platform)?.label}
                  </Badge>
                ))}
                {filters.location !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {filters.location}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              </div>
            )}

            <Separator />

            {/* Platform Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-accent" />
                <span className="font-medium">Platforms</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {platforms.map(platform => (
                  <Button
                    key={platform.value}
                    variant={filters.platforms.includes(platform.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePlatformToggle(platform.value)}
                    className={
                      filters.platforms.includes(platform.value)
                        ? "bg-gradient-primary hover:opacity-90"
                        : "hover:bg-accent/10 hover:border-accent/30 hover:text-accent"
                    }
                  >
                    {platform.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Location Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="font-medium">Location</span>
              </div>
              <Select value={filters.location} onValueChange={handleLocationChange}>
                <SelectTrigger className="bg-surface border-border focus:border-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="online">Online Only</SelectItem>
                  <SelectItem value="offline">Offline Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}