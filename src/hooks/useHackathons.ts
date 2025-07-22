import { useQuery } from "@tanstack/react-query";
import { Hackathon, ApiResponse, Platform, FilterState } from "@/types/hackathon";

const API_BASE = "http://43.205.44.57:8080";

async function fetchHackathons(endpoint = "/get-all-hackathons"): Promise<Hackathon[]> {
  const response = await fetch(`${API_BASE}/api${endpoint}`);
  if (!response.ok) {
    throw new Error("Failed to fetch hackathons");
  }
  const data: ApiResponse = await response.json();
  if (!data.success) {
    throw new Error("API returned unsuccessful response");
  }
  return data.hackathons;
}

export function useHackathons() {
  const {
    data: hackathons = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Hackathon[], Error>({
    queryKey: ["hackathons"],
    queryFn: () => fetchHackathons(),
  });

  const fetchByPlatform = async (platform: Platform): Promise<Hackathon[]> => {
    return fetchHackathons(`/get-${platform}`);
  };

  const searchHackathons = async (query: string): Promise<Hackathon[]> => {
    const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Search request failed");

    const data: ApiResponse = await response.json();
    if (!data.success) throw new Error("Search failed");

    return data.hackathons;
  };

  const filterHackathons = async (filters: FilterState): Promise<Hackathon[]> => {

    const queryparams = new URLSearchParams();
    if(filters.location && filters.location !== "all") {
      queryparams.append("mode", filters.location);
    }
     
        if(filters.platforms.length > 0) {
          filters.platforms.forEach(platform => {
          queryparams.append("p", platform);
          });
        }


  const queryString = queryparams.toString();
  const response = await fetch(`${API_BASE}/api/get-all-hackathons${queryString ? "?" + queryString : ""}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to fetch filtered hackathons");

  const data: ApiResponse = await response.json();
  if (!data.success) throw new Error("Filtering failed");

  return data.hackathons;
  };

  return {
    hackathons,
    loading,
    error: error?.message ?? null,
    refetch,
    fetchByPlatform,
    searchHackathons,
    filterHackathons,
  };
}
