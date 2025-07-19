import { Calendar, Search, Bookmark, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  type: "search" | "bookmarks" | "platform" | "error";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "search":
        return <Search className="h-12 w-12 text-muted-foreground" />;
      case "bookmarks":
        return <Bookmark className="h-12 w-12 text-muted-foreground" />;
      case "platform":
        return <Calendar className="h-12 w-12 text-muted-foreground" />;
      case "error":
        return <AlertCircle className="h-12 w-12 text-destructive" />;
      default:
        return <Calendar className="h-12 w-12 text-muted-foreground" />;
    }
  };

  const getIllustration = () => {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-glow rounded-full blur-xl opacity-20"></div>
        <div className="relative p-6 rounded-full bg-surface border border-border">
          {getIcon()}
        </div>
      </div>
    );
  };

  return (
    <Card className="glass-effect border-dashed border-border/50">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
        {getIllustration()}
        
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {action && (
          <Button 
            onClick={action.onClick}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {action.label}
          </Button>
        )}

        {type === "bookmarks" && (
          <div className="pt-4 space-y-2 text-sm text-muted-foreground">
            <p>💡 <strong>Tip:</strong> Click the bookmark icon on any hackathon card to save it for later</p>
          </div>
        )}

        {type === "search" && (
          <div className="pt-4 space-y-2 text-sm text-muted-foreground">
            <p>Try adjusting your search terms or filters to find more hackathons</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}