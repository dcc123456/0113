export interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
  path: string;
  bgColor: string;
}

export interface GameCategory {
  id: string;
  name: string;
  games: Game[];
}
