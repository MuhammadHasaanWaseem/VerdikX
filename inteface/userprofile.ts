
interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  favourite_games: string[];
  game_uid?: string | null;
  user_level?: number | null;
  playstyle?: string | null;
  username: string;
  avatar?: string | null;
  created_at?: string;
  User_about: string;
  tournaments_participated:number
}
export type { UserProfile };

