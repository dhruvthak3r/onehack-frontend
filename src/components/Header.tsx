import { Link, useLocation } from "react-router-dom";
import { Bookmark, Calendar, Code, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary">
              <Code className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gradient">HackHub</h1>
              <p className="text-xs text-muted-foreground -mt-1">Discover hackathons</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive("/") ? "secondary" : "ghost"}
              size="sm"
              asChild
              className={isActive("/") ? "bg-accent/10 text-accent" : "hover:bg-accent/10 hover:text-accent"}
            >
              <Link to="/" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                All Hackathons
              </Link>
            </Button>

            <Button
              variant={isActive("/bookmarks") ? "secondary" : "ghost"}
              size="sm"
              asChild
              className={isActive("/bookmarks") ? "bg-accent/10 text-accent" : "hover:bg-accent/10 hover:text-accent"}
            >
              <Link to="/bookmarks" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Bookmarks
              </Link>
            </Button>

            {/* Platform Links */}
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
              {[
                { name: "Devfolio", path: "/platform/devfolio", color: "blue" },
                { name: "DevPost", path: "/platform/devpost", color: "green" },
                { name: "Unstop", path: "/platform/unstop", color: "purple" },
                { name: "DoraHacks", path: "/platform/dorahacks", color: "orange" }
              ].map(platform => (
                <Button
                  key={platform.path}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={
                    isActive(platform.path)
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-accent/10 hover:text-accent"
                  }
                >
                  <Link to={platform.path}>
                    {platform.name}
                  </Link>
                </Button>
              ))}
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/bookmarks">
                <Bookmark className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* GitHub Link */}
          <div className="hidden lg:flex items-center gap-2">
            <Badge variant="secondary" className="bg-surface hover:bg-surface-hover transition-colors">
              <span className="animate-pulse w-2 h-2 bg-success rounded-full mr-2"></span>
              Live
            </Badge>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}