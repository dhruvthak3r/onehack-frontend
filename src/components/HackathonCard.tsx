import { useState } from "react";
import { Calendar, MapPin, ExternalLink, /* Bookmark, BookmarkCheck, */ Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hackathon } from "@/types/hackathon";
import { format, isAfter, isBefore, differenceInDays } from "date-fns";

interface HackathonCardProps {
  hackathon: Hackathon;
  // isBookmarked?: boolean;
  // onBookmarkToggle?: (hackathon: Hackathon) => void;
}



export function HackathonCard({ hackathon /*, isBookmarked = false, onBookmarkToggle */ }: HackathonCardProps) {
  // const [bookmarked, setBookmarked] = useState(isBookmarked);
  // const [isLoading, setIsLoading] = useState(false);

  const startDate = new Date(`${hackathon.start_date}T00:00:00Z`);
  const endDate = new Date(`${hackathon.end_date}T00:00:00Z`);

  const now = new Date();
  
  const isUpcoming = isAfter(hackathon.start_date, now);
  const isLive = !isBefore(hackathon.end_date, now) && !isAfter(hackathon.start_date, now);
  const isPast = isBefore(endDate, now);
  
  const daysUntilStart = isUpcoming ? differenceInDays(startDate, now) : 0;

  // const handleBookmarkToggle = async () => {
  //   if (!onBookmarkToggle) return;
    
  //   setIsLoading(true);
  //   try {
  //     await onBookmarkToggle(hackathon);
  //     setBookmarked(!bookmarked);
  //   } catch (error) {
  //     console.error("Error toggling bookmark:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(hackathon.title);
    const details = encodeURIComponent(`Registration: ${hackathon.url}`);
    const location = encodeURIComponent(hackathon.mode);
    const startDateISO = format(startDate, "yyyyMMdd'T'HHmmss'Z'");
    const endDateISO = format(endDate, "yyyyMMdd'T'HHmmss'Z'");
    
    const calendarUrl = `http://43.205.44.57:8080/api/add-to-calendar/${hackathon.id}`
    window.open(calendarUrl, '_blank');
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      devfolio: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      devpost: "bg-green-500/10 text-green-400 border-green-500/20",
      unstop: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      dorahacks: "bg-orange-500/10 text-orange-400 border-orange-500/20"
    };
    return colors[platform as keyof typeof colors] || "bg-accent/10 text-accent border-accent/20";
  };

  const getStatusBadge = () => {
    if (isLive) return <Badge className="bg-success/10 text-success border-success/20">Live</Badge>;
    if (isUpcoming) return <Badge className="bg-primary/10 text-primary border-primary/20">Upcoming</Badge>;
    if (isPast) return <Badge variant="secondary">Ended</Badge>;
    return null;
  };

  return (
    <Card className="group card-hover glass-effect overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-accent transition-colors">
              {hackathon.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getPlatformColor(hackathon.platform)}>
                {hackathon.platform}
              </Badge>
              {getStatusBadge()}
            </div>
          </div>

          {/* Bookmark button removed */}
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmarkToggle}
            disabled={isLoading}
            className="shrink-0 hover:bg-accent/10 hover:text-accent"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-accent" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button> */}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            <span>
              {format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            <span>{hackathon.mode}</span>
          </div>

          {isUpcoming && daysUntilStart > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-primary">
                {daysUntilStart === 1 ? "Tomorrow" : `${daysUntilStart} days to go`}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddToCalendar}
            className="flex-1 hover:bg-accent/10 hover:border-accent/30 hover:text-accent"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
          </Button>
          
          <Button 
            size="sm" 
            onClick={() => window.open(hackathon.url, '_blank')}
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Register
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
