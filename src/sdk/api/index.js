export function convertPageToOffset(page, pageSize) {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  return { offset, limit };
}

export function convertOffsetToPage(offset, limit) {
  const pageSize = limit;
  const page = Math.floor(offset / limit) + 1;
  return { page, pageSize };
}

export function getNextPageParam(lastPage) {
  if (!lastPage.next) return undefined;

  const urlParams = new URLSearchParams(new URL(lastPage.next).search);
  const offset = parseInt(urlParams.get("offset"), 10);
  const limit = parseInt(urlParams.get("limit"), 10);

  const { page } = convertOffsetToPage(offset, limit);
  return page;
}

export function getPreviousPageParam(firstPage) {
  if (!firstPage.previous) return undefined;

  const urlParams = new URLSearchParams(new URL(firstPage.previous).search);
  const offset = parseInt(urlParams.get("offset"), 10);
  const limit = parseInt(urlParams.get("limit"), 10);

  const { page } = convertOffsetToPage(offset, limit);
  return page;
}
