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

export interface Location {
  id: number;
  title: string;
  desc: string;
  match: number;
  matchText: string;
  lat: number;
  lng: number;
  img: string;
  videos: string[];
}

export type AppState = 
  | 'landing' 
  | 'onboarding' 
  | 'profile' 
  | 'loading' 
  | 'route_selection' 
  | 'final_route';

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
