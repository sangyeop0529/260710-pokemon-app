export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  // 포켓몬은 타입이 2개까지 가능
  types: {
    type: {
      name: string;
    };
  }[];
}
