export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const queryParams = {};

  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }

  return queryParams;
}
