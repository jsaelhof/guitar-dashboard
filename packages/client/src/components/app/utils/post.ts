export const post = async (
  path: string,
  body?: BodyInit | undefined | null
): ReturnType<typeof fetch> =>
  await fetch(
    `${import.meta.env.VITE_SERVER_URL}${
      path.startsWith("/") ? "" : "/"
    }${path}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body,
    }
  );
