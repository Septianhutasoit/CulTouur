// Destination
export  interface Destination {
    id?: number;
    name: string;
    category: string;
    location: string;
    description: string;
    rating: number;
    price_range?: string;
    latitude?: number;
    longitude?: number;
    image_url?: string;
    duration_hours?: number;
}

// Search - sesuai GET
export interface SearchResult {
    destinations: Destination;
    score: number;
}

// Chat — pakai "text" bukan "content" agar konsisten dengan ai/page.tsx
export interface ChatMessage {
    role: 'user' | 'bot';
    text: string;
    results?: SearchResult[];
}
export interface ChatRequest {
    message: string;
    history?: ChatMessage[];
}
export interface ChatResponse {
    reply: string;
    recommendations?: Destination[];
    results?: SearchResult[];
}

// Trip Planner
export interface PlannerPreference {
    start_location: string;
    duration_days: number;
    budget: 'hemat' | 'sedang' | 'bebas';
    category: string;
    group_size: number;
}

export interface ItineraryItem {
    time: string;
    destination: Destination;
    duration_minutes: number;
    estimated_cost: number;
    notes?: string;
}

export interface ItineraryDay {
    day: number;
    title: string;
    items: ItineraryItem[];
    total_cost: number;
}

export interface TripPlan {
    days: ItineraryDay[];
    total_cost: number;
    ai_match_score: number;
    summary: string;
}

// Culturepedia
export interface CultureEntry {
    id: number;
    title: string;
    category: 'tradisi' | 'kuliner' | 'kesenian' | 'bahasa' | 'sejarah';
    description: string;
    image_url?: string;
    related_destinations?: string[];
}