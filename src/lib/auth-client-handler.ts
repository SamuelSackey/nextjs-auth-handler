import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { jwtExpiryDate } from "./jwt";

export type TUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  projects: [];
};

export type Session = {
  user: TUser;
  token: string;
};

type TSessionResponse = {
  data: {
    session: Session | null;
  };
  error: string | null;
};

type TAuthClientHandler = {
  signUp(username: string, email: string, password: string): void;
  signIn(email: string, password: string): void;
  signOut(): void;
  getSession(): Promise<TSessionResponse>;
};

export default class AuthClientHandler implements TAuthClientHandler {
  private static instance: AuthClientHandler | null = null;

  constructor() {}

  static create(): AuthClientHandler {
    if (!AuthClientHandler.instance) {
      AuthClientHandler.instance = new AuthClientHandler();
    }
    return AuthClientHandler.instance;
  }

  async signUp(
    username: string,
    email: string,
    password: string
  ): Promise<{ error: string | null }> {
    // Convert credentials to json
    const body = JSON.stringify({ username, email, password });

    try {
      const res = await fetch(
        "http://localhost:8080/user_api/api/v1/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        }
      );

      if (res.ok) {
        const { access_token }: { access_token: string } = await res.json();

        const expiryDate = () => {
          const date = jwtExpiryDate(access_token);
          date.setMinutes(date.getMinutes() - 15);
          return date;
        };

        setCookie("auth-token", access_token, {
          expires: expiryDate(),
          secure: true,
        });

        return { error: null };
      }

      const error = await res.json();

      throw new Error(error.detail);
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  async signIn(
    email: string,
    password: string
  ): Promise<{ error: string | null }> {
    // Convert credentials to url encoded string
    const data = new URLSearchParams();
    data.append("username", email);
    data.append("password", password);
    const body = data.toString();

    try {
      const res = await fetch("http://localhost:8080/user_api/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      if (res.ok) {
        const { access_token }: { access_token: string } = await res.json();

        const expiryDate = () => {
          const date = jwtExpiryDate(access_token);
          date.setMinutes(date.getMinutes() - 15);
          return date;
        };

        setCookie("auth-token", access_token, {
          expires: expiryDate(),
          secure: true,
        });

        return { error: null };
      }

      const error = await res.json();

      throw new Error(error.detail);
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    const res = await fetch("http://localhost:8080/user_api/api/v1/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      deleteCookie("auth-token");
      return { error: null };
    }

    return { error: "error logging out" };
  }

  async getSession(): Promise<TSessionResponse> {
    const token = getCookie("auth-token");

    if (token) {
      const isValid = jwtExpiryDate(token) > new Date();

      if (isValid) {
        try {
          const res = await fetch(
            "http://localhost:8080/user_api/api/v1/details",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const user = await res.json();

            return {
              data: { session: { user, token } },
              error: null,
            };
          }

          const error = await res.json();

          throw new Error(error.detail);
        } catch (error) {
          // user response error
          return { data: { session: null }, error: (error as Error).message };
        }
      }

      // token expired
      return { data: { session: null }, error: "token expired" };
    }

    // not logged in
    return { data: { session: null }, error: "user not logged in" };
  }
}
