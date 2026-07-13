import { useEffect, useRef, useState } from "react";
import type { PokemonDetail } from "../types";
import { getPokemonListWithDetails } from "../api/pokemon";

const LIMIT = 20;

const PokemonList = () => {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setOffset((prev) => prev + LIMIT);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const newPokemons = await getPokemonListWithDetails(offset, LIMIT);
        setPokemons((prev) => [...prev, ...newPokemons]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [offset]);

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4">포켓몬 도감</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="border rounded-lg p-3 text-center">
            <img
              src={pokemon.sprites.front_default ?? ""}
              alt={pokemon.name}
              className="mx-auto"
            />
            <p className="font-bold capitalize">{pokemon.name}</p>
            <div className="flex gap-1 justify-center mt-1">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center py-4">로딩 중...</p>}
      <div ref={observerTarget} className="h-10"></div>
    </div>
  );
};

export default PokemonList;
