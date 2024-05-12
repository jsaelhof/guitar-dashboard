export const updateServer = async (
  url: string,
  body?: Record<string, unknown>
) => {
  const response = await fetch(`http://localhost:8001/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    ...(body && {
      body: JSON.stringify(body),
    }),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
