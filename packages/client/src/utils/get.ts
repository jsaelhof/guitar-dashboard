export const get = async (path: string): ReturnType<typeof fetch> =>
  await fetch(
    `${import.meta.env.VITE_SERVER_URL}${
      path.startsWith("/") ? "" : "/"
    }${path}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    }
  );
