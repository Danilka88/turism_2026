// User Profile Types
export interface UserProfile {
  id: string;
  interests: Interest[];
  companions: Companion[];
  preferences: UserPreferences;
  history: UserHistory;
  preferredCategories?: string[];
  travelStyle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interest {
  id: number;
  category: string;
  name: string;
  liked: boolean;
  comment?: string;
}

export interface Companion {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

export interface UserPreferences {
  dates?: {
    start: string;
    end: string;
  };
  startingCity?: string;
  foodPreferences: string[];
  noKidsMode: boolean;
  budget?: 'low' | 'medium' | 'high';
}

export interface UserHistory {
  viewedLocations: number[];
  selectedLocations: number[];
  rejectedLocations: number[];
  bookings: Booking[];
}

export interface Booking {
  locationId: number;
  date: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Location Types
export interface Location {
  id: number;
  title: string;
  description: string;
  extendedDescription?: string;
  match: number;
  matchText: string;
  tags: string[];
  lat: number;
  lng: number;
  img: string;
  videos: string[];
  foodOptions: FoodOption[];
  activities: ActivityOption[];
  category?: string;
  rating?: number;
}

export interface FoodOption {
  id: string;
  name: string;
  icon: string;
  places?: string[];
}

export interface ActivityOption {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

// Agent Types
export type AgentType = 
  | 'onboarding'
  | 'route_matcher'
  | 'wine_scanner'
  | 'emergency_route'
  | 'description_generator'
  | 'personalization';

export interface AgentRequest<T = unknown> {
  agentType: AgentType;
  data: T;
  context?: Record<string, unknown>;
}

export interface AgentResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    model: string;
    duration: number;
    tokens: number;
  };
}

// Onboarding Agent
export interface OnboardingInput {
  selectedInterests: Array<{ id: number; liked: boolean; comment?: string }>;
}

export interface OnboardingOutput {
  profile: UserProfile;
  summary: string;
  recommendedCategories: string[];
}

// Route Matcher Agent
export interface RouteMatcherInput {
  userProfile: UserProfile;
  locations: Location[];
  filters?: RouteFilters;
}

export interface RouteFilters {
  categories?: string[];
  maxDistance?: number;
  maxPrice?: number;
}

export interface RouteMatcherOutput {
  matchedLocations: MatchedLocation[];
  summary: string;
  recommendations: string[];
}

export interface MatchedLocation extends Location {
  matchScore: number;
  matchReasons: string[];
  bestTimeToVisit?: string;
}

// Wine Scanner Agent
export interface WineScannerInput {
  wineDescription?: string;
  wineName?: string;
  region?: string;
  grapeVariety?: string;
}

export interface WineScannerOutput {
  winery: {
    name: string;
    location: string;
    description: string;
    match: number;
  };
  wines: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  nearbyLocations: Location[];
  tourRecommendation: string;
}

// Emergency Route Agent
export type EmergencyProblem = 
  | 'weather'
  | 'closed'
  | 'crowded'
  | 'bored'
  | 'traffic'
  | 'budget';

export interface EmergencyRouteInput {
  problem: EmergencyProblem;
  currentLocation?: Location;
  userPreferences?: Partial<UserPreferences>;
  allLocations: Location[];
}

export interface EmergencyRouteOutput {
  alternatives: Array<{
    location: Location;
    solution: string;
    distance: string;
    estimatedTime: string;
  }>;
  advice: string;
}

// Description Generator Agent
export interface DescriptionGeneratorInput {
  location: Partial<Location>;
  tone?: 'formal' | 'casual' | 'adventurous' | 'romantic';
}

export interface DescriptionGeneratorOutput {
  title: string;
  shortDescription: string;
  extendedDescription: string;
  tags: string[];
  matchText: string;
  activityDescriptions: string[];
  foodDescriptions: string[];
}

// Personalization Agent
export interface PersonalizationInput {
  userProfile: UserProfile;
  recentActions: UserAction[];
}

export interface UserAction {
  type: 'view' | 'select' | 'reject' | 'book';
  locationId: number;
  timestamp: string;
}

export interface PersonalizationOutput {
  insights: string[];
  adjustedPreferences: Partial<UserPreferences>;
  nextRecommendations: string[];
}
