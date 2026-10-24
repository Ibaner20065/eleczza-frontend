export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          roll_number: string;
          agency_id: string | null;
          rank: string;
          reputation_points: number;
          solved_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          roll_number: string;
          agency_id?: string | null;
          rank?: string;
          reputation_points?: number;
          solved_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          roll_number?: string;
          agency_id?: string | null;
          rank?: string;
          reputation_points?: number;
          solved_count?: number;
          created_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          motto: string | null;
          passcode: string;
          leader_id: string;
          score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          motto?: string | null;
          passcode: string;
          leader_id: string;
          score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          motto?: string | null;
          passcode?: string;
          leader_id?: string;
          score?: number;
          created_at?: string;
        };
      };
    };
  };
}
