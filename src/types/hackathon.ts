export interface Hackathon {
  id : String;
  title: string;
  start_date: string;
  end_date: string;
  mode: string;
  platform: string;
  url: string;
}

export interface ApiResponse {
  hackathons: Hackathon[];
  success: boolean;
}

export interface BookmarkResponse {
  message: string;
}


export type Platform = "devfolio" | "devpost" | "unstop" | "dorahacks";

export interface FilterState {
  platforms: Platform[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  location: "all" | "online" | "offline";
  search: string;
}


