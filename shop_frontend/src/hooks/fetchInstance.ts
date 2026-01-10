import { SERVER_URI } from "../../uri/uril";
const BASE_URL = SERVER_URI as string;

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

// Add callbacks to run when token refresh completes
const subscribeTokenRefresh = (callback: () => void): void => {
  refreshSubscribers.push(callback);
};

// Run all subscriber callbacks once the token is refreshed
const onRefreshed = (): void => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// const handleLogout = (): void => {
//   if (!window.location.href.includes("login")) {
//     window.location.href = "/login";
//   }
// };

interface FetchConfig extends RequestInit {
  _retry?: boolean;
}

// ----------- MAIN FETCH WRAPPER ------------
export async function apiFetch(
  url: string,
  options: FetchConfig = {}
): Promise<Response> {
  const fullUrl = `${BASE_URL}${url}`;

  const config: FetchConfig = {
    ...options,
    credentials: "include", // same as axios withCredentials
  };

  const response = await fetch(fullUrl, config);

  // If successful, return
  if (response.status !== 401) {
    return response;
  }

  // If 401, try refresh flow
  return handle401(fullUrl, config);
}

// ----------- 401 HANDLER / TOKEN REFRESH FLOW ------------
async function handle401(url: string, config: FetchConfig): Promise<Response> {
  // Prevent infinite retry loop
  if (config._retry) {
    return Promise.reject(new Error("Unauthorized"));
  }
  config._retry = true;

  // If refresh is already in progress, wait for it
  if (isRefreshing) {
    return new Promise<Response>((resolve) => {
      subscribeTokenRefresh(async () => {
        resolve(fetch(url, config));
      });
    });
  }

  // Start refresh
  isRefreshing = true;

  try {
    const refreshResponse = await fetch(`${BASE_URL}/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      // handleLogout();
      throw new Error("Refresh token failed");
    }

    isRefreshing = false;

    // Release queued requests
    onRefreshed();

    return fetch(url, config); // retry original request
  } catch (err) {
    isRefreshing = false;
    // handleLogout();
    return Promise.reject(err);
  }
}
