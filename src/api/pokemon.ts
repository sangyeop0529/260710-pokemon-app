import type { PokemonDetail, PokemonListItem } from "../types";

export const getPokemonList = async (
  offset: number,
  limit: number,
): Promise<PokemonListItem[]> => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
  );
  if (!res.ok) throw new Error("포켓몬 목록을 가져오는데 실패했습니다.");
  const data = await res.json();
  return data.results;
};

export const getPokemonDetail = async (url: string): Promise<PokemonDetail> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("포켓몬 상세 정보를 가져오는데 실패했습니다.");
  const data = await res.json();
  return data;
};

export const getPokemonListWithDetails = async (
  offset: number,
  limit: number,
): Promise<PokemonDetail[]> => {
  const list = await getPokemonList(offset, limit);

  const details = await Promise.all(
    list.map((item) => getPokemonDetail(item.url)),
  );

  return details;
};
