export interface OnboardingCard {
  id: number;
  text: string;
  img: string;
}

export interface Fighter {
  id: string;
  name: string;
  icon: string;
  color: string;
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

export interface Location {
  id: number;
  title: string;
  desc: string;
  extendedDesc: string;
  match: number;
  matchText: string;
  tags: string[];
  lat: number;
  lng: number;
  img: string;
  videos: string[];
  foodOptions: FoodOption[];
  activities: ActivityOption[];
}

export interface SelectedExtras {
  [locationId: number]: {
    food: string[];
    activities: string[];
  };
}

export type AppState = 
  | 'landing' 
  | 'onboarding' 
  | 'profile' 
  | 'loading' 
  | 'route_selection' 
  | 'final_route'
  | 'wine_scanner'
  | 'emergency_route';

export interface UserAnswers {
  interests: Record<number, { liked: boolean; comment: string }>;
  companions: string[];
  dates: {
    start: string;
    end: string;
  };
  location: string;
  noKidsMode: boolean;
}
