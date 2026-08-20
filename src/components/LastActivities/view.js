import { useActivitiesFilterStore } from "@/store/activitiesFilter";

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

export const ACTIVITIES_HREF = "/activities";

export const getExtractHref = () => ACTIVITIES_HREF;

export const applyActivitiesShortcutFilter = (parentId) => {
  useActivitiesFilterStore.getState().setParentId(parentId ?? null);
};
