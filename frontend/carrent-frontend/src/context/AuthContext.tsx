  import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
  } from "react";

  import {
    loginUser,
    registerUser,
  } from "@/lib/api";

  type AuthContextType = {
    user: any;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;

    login: (
      email: string,
      password: string
    ) => Promise<any>;

    register: (
      data: any
    ) => Promise<any>;

    logout: () => void;
  };

  const AuthContext =
    createContext<AuthContextType>({
      user: null,
      token: null,
      loading: true,
      isAuthenticated: false,

      login: async () => ({}),

      register: async () => ({}),

      logout: () => {},
    });

  export function AuthProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {

    const [user, setUser] =
      useState<any>(null);

    const [token, setToken] =
      useState<string | null>(
        localStorage.getItem(
          "token"
        )
      );

    const [loading, setLoading] =
      useState(true);

    useEffect(() => {

      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (storedUser) {

        setUser(
          JSON.parse(
            storedUser
          )
        );
      }

      setLoading(false);

    }, []);

    async function login(
      email: string,
      password: string
    ) {

      const response =
        await loginUser({
          email,
          password,
        });

      if (response?.token) {

        localStorage.setItem(
          "token",
          response.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.user
          )
        );

        setToken(
          response.token
        );

        setUser(
          response.user
        );
      }

      return response;
    }

    async function register(
      data: any
    ) {

      const response =
        await registerUser(
          data
        );

      if (response?.token) {

        localStorage.setItem(
          "token",
          response.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.user
          )
        );

        setToken(
          response.token
        );

        setUser(
          response.user
        );
      }

      return response;
    }

    function logout() {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      // ----- NEW: clear any stale mid-booking flags on logout -----
      localStorage.removeItem("selectedCar");
      localStorage.removeItem("selectedCarTimestamp");

      setToken(null);

      setUser(null);

      window.location.href =
        "/login";
    }

    const value = useMemo(
      () => ({
        user,
        token,
        loading,

        isAuthenticated:
          !!token,

        login,
        register,
        logout,
      }),

      [
        user,
        token,
        loading,
      ]
    );

    return (
      <AuthContext.Provider
        value={value}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  export const useAuth = () =>
    useContext(AuthContext);