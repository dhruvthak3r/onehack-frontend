import { useState, useEffect } from "react";
import { Hackathon, ApiResponse, Platform, FilterState } from "@/types/hackathon";

// Mock data for development
const MOCK_HACKATHONS: Hackathon[] = [
  {
    title: "AI Revolution Hackathon 2025",
    startDate: "2025-08-15T00:00:00Z",
    endDate: "2025-08-17T23:59:59Z",
    registrationStartDate: "2025-07-20T00:00:00Z",
    registrationEndDate: "2025-08-10T23:59:59Z",
    location: "Remote",
    platform: "devfolio",
    registrationUrl: "https://devfolio.co/ai-hack-2025",
    tags: ["AI", "Machine Learning", "Web3"],
    description: "Build the next generation of AI applications",
    prizePool: "$50,000"
  },
  {
    title: "Web3 Builder Summit",
    startDate: "2025-09-01T00:00:00Z",
    endDate: "2025-09-03T23:59:59Z",
    location: "San Francisco, CA",
    platform: "devpost",
    registrationUrl: "https://devpost.com/web3-summit-2025",
    tags: ["Blockchain", "DeFi", "Smart Contracts"],
    prizePool: "$75,000"
  },
  {
    title: "Climate Tech Challenge",
    startDate: "2025-07-28T00:00:00Z",
    endDate: "2025-07-30T23:59:59Z",
    location: "Remote",
    platform: "unstop",
    registrationUrl: "https://unstop.com/climate-tech-2025",
    tags: ["Climate", "Sustainability", "IoT"],
    prizePool: "$30,000"
  },
  {
    title: "Gaming Innovation Jam",
    startDate: "2025-08-05T00:00:00Z",
    endDate: "2025-08-07T23:59:59Z",
    location: "Austin, TX",
    platform: "dorahacks",
    registrationUrl: "https://dorahacks.io/gaming-jam-2025",
    tags: ["Gaming", "VR", "Unity"],
    prizePool: "$25,000"
  },
  {
    title: "FinTech Future Hackathon",
    startDate: "2025-08-20T00:00:00Z",
    endDate: "2025-08-22T23:59:59Z",
    location: "New York, NY",
    platform: "devfolio",
    registrationUrl: "https://devfolio.co/fintech-future-2025",
    tags: ["FinTech", "Banking", "Payment"],
    prizePool: "$60,000"
  },
  {
    title: "Healthcare Innovation Challenge",
    startDate: "2025-09-10T00:00:00Z",
    endDate: "2025-09-12T23:59:59Z",
    location: "Remote",
    platform: "devpost",
    registrationUrl: "https://devpost.com/healthcare-innovation-2025",
    tags: ["Healthcare", "Medical", "AI"],
    prizePool: "$40,000"
  }
];

export function useHackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHackathons = async (endpoint = "/get-all-hackathons") => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`/api${endpoint}`);
      // const data: ApiResponse = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for now
      const data: ApiResponse = {
        hackathons: MOCK_HACKATHONS,
        success: true
      };
      
      if (data.success) {
        setHackathons(data.hackathons);
      } else {
        throw new Error("Failed to fetch hackathons");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchByPlatform = async (platform: Platform) => {
    await fetchHackathons(`/get-${platform}`);
  };

  const searchHackathons = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app: const response = await fetch(`/api/search?query=${query}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = MOCK_HACKATHONS.filter(hackathon =>
        hackathon.title.toLowerCase().includes(query.toLowerCase()) ||
        hackathon.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        hackathon.location.toLowerCase().includes(query.toLowerCase())
      );
      
      setHackathons(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const filterHackathons = (filters: FilterState) => {
    let filtered = [...MOCK_HACKATHONS];

    // Platform filter
    if (filters.platforms.length > 0) {
      filtered = filtered.filter(h => filters.platforms.includes(h.platform));
    }

    // Location filter
    if (filters.location === "remote") {
      filtered = filtered.filter(h => h.location.toLowerCase() === "remote");
    } else if (filters.location === "offline") {
      filtered = filtered.filter(h => h.location.toLowerCase() !== "remote");
    }

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(h =>
        h.title.toLowerCase().includes(query) ||
        h.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        h.location.toLowerCase().includes(query)
      );
    }

    setHackathons(filtered);
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  return {
    hackathons,
    loading,
    error,
    fetchHackathons,
    fetchByPlatform,
    searchHackathons,
    filterHackathons,
    refetch: () => fetchHackathons()
  };
}