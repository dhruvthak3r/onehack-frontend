export interface Hackathon {
  title: string;
  startDate: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  location: string;
  platform: "devfolio" | "devpost" | "unstop" | "dorahacks";
  registrationUrl: string;
  tags?: string[];
  description?: string;
  prizePool?: string;
}

export interface ApiResponse {
  hackathons: Hackathon[];
  success: boolean;
}

export type Platform = "devfolio" | "devpost" | "unstop" | "dorahacks";

export interface FilterState {
  platforms: Platform[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  location: "all" | "remote" | "offline";
  search: string;
}