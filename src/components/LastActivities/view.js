export const LastActivitiesView = {
  loading: "loading",
  error: "error",
  empty: "empty",
  data: "data",
};

export const getLastActivitiesView = ({ loading, error, data } = {}) => {
  if (loading) return LastActivitiesView.loading;
  if (error) return LastActivitiesView.error;
  if (!data?.length) return LastActivitiesView.empty;
  return LastActivitiesView.data;
};

export const getExtractHref = (parentId) => {
  if (parentId == null || parentId === "") return "/home/extrato";
  return `/home/dependent/${parentId}/extrato`;
};
