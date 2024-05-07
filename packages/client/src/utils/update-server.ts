export const updateServer = async (
  url: string,
  callback?: (ok: boolean, data: any) => void
) => {
  const response = await fetch(`http://localhost:8001/${url}`, {
    method: "POST",
  });
  const data = await response.json();
  callback && callback(response.ok, data);
};
