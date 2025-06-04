// データベース型定義（Supabase生成）
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          updated_at?: string;
        };
      };
      
      locations: {
        Row: {
          id: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          category: string;
          rating?: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          latitude: number;
          longitude: number;
          category: string;
          rating?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          category?: string;
          rating?: number;
        };
      };
      
      trip_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description?: string;
          duration_hours: number;
          mood: string;
          transport_type: string;
          created_at: string;
          route_data: any; // JSON
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          duration_hours: number;
          mood: string;
          transport_type: string;
          created_at?: string;
          route_data: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          duration_hours?: number;
          mood?: string;
          transport_type?: string;
          route_data?: any;
        };
      };
      
      favorites: {
        Row: {
          id: string;
          user_id: string;
          location_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          location_id?: string;
        };
      };
    };
    
    Views: {
      [_ in never]: never;
    };
    
    Functions: {
      [_ in never]: never;
    };
    
    Enums: {
      mood_type: 'relaxed' | 'active' | 'cultural' | 'gourmet' | 'shopping' | 'nature';
      transport_type: 'walk' | 'bicycle' | 'public_transport' | 'car';
    };
  };
}
