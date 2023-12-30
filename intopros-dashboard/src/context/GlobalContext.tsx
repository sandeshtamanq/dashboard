import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../utils/api";
import { deleteToken, getToken } from "../utils/cookies";

interface IGlobalContext {
  user: any;
  setUser: Function;
  isLoggedIn: boolean;
  hasToken: () => boolean;
  isAdmin: boolean;
}

const GlobalContext = createContext<IGlobalContext>({
  user: null,
  setUser: () => null,
  isLoggedIn: false,
  hasToken: () => false,
  isAdmin: false,
});

const GlobalProvider = ({ children }: any) => {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const isLoggedIn = user !== null;

  const hasToken = () => {
    const token = getToken();
    return !!token;
  };

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (router.pathname === "/login") {
      if (hasToken()) {
        makeRequest("/users/me").then((resp) => {
          if (!resp) return;
          if (["admin", "support"].includes(resp?.data?.data?.role)) {
            setUser(resp?.data?.data);
            deleteToken();
            router.push("/");
          }
        });
      }
    } else {
      if (!hasToken()) {
        router.push("/login");
      } else {
        makeRequest("/users/me").then((resp) => {
          if (!resp) return;
          setUser(resp?.data?.data);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (router.pathname === "/login") {
      if (hasToken()) {
        makeRequest("/users/me").then((resp) => {
          if (!resp) return;
          if (["admin", "support"].includes(resp?.data?.data?.role)) {
            setUser(resp?.data?.data);
            deleteToken();
            router.push("/");
          }
        });
      }
    } else {
      if (!hasToken()) {
        router.push("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        hasToken,
        isAdmin,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
export { GlobalContext, GlobalProvider };
