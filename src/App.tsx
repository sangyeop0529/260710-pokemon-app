import { useEffect, useRef, useState } from "react";
import type { PokemonDetail } from "./types";
import { getPokemonListWithDetails } from "./api/pokemon";

function App() {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // entries[0].isIntersecting: 감지 대상이 화면에 보이는지 여부 (true/false)
        if (entries[0].isIntersecting) {
          // 화면에 보였다! → 다음 페이지 로드 트리거
          setOffset((prev) => prev + 20);
        }
      },
      { threshold: 1.0 }, // 대상이 100% 보일 때 콜백 실행,
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
        const newPokemons = await getPokemonListWithDetails(offset, 20);
        setPokemons((prev) => [...prev, ...newPokemons]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [offset]);

  return <div ref={observerTarget}></div>;
}

export default App;
