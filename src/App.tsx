import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { signIn, signOut, signUp } from "./api/auth";
import { supabase } from "./lib/supabaseClient";
import PokemonList from "./components/PokemonList";
import LoginForm from "./components/LoginForm";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setAuthError(null);
    } catch (err) {
      console.error(err);
      setAuthError("회원가입에 실패했습니다.");
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      setAuthError(null);
    } catch (err) {
      console.error(err);
      setAuthError("로그인에 실패했습니다.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    } finally {
      setSession(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); // 받아온 세션을 상태에 반영
      setAuthLoading(false); // "확인 끝났다" 표시 (깜빡임 방지)
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session); // 로그인/로그아웃될 때마다 최신 세션으로 갱신
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (authLoading) return <p>로딩 중...</p>;

  return (
    <div>
      {session ? (
        <div className="max-w-4xl mx-auto mt-10 px-4">
          <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow">
            <p className="text-lg font-bold text-gray-800">
              환영합니다, {session.user.email}님!
            </p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              로그아웃
            </button>
          </div>
          <PokemonList />
        </div>
      ) : (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={authError}
            handleSignUp={handleSignUp}
            handleSignIn={handleSignIn}
          />
        </div>
      )}
    </div>
  );
}

export default App;
