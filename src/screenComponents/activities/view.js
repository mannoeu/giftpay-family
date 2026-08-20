export const FAMILY_FILTER_ID = null;

export const getActivitiesFilterName = (parentId, dependents = []) => {
  if (parentId == null || parentId === "") return "Todos";

  const dependent = dependents.find(
    (item) => String(item?.id) === String(parentId),
  );

  return dependent?.name ?? "Todos";
};

export const getActivitiesFilterButtonLabel = (parentId, dependents) =>
  `Filtrar: ${getActivitiesFilterName(parentId, dependents)}`;

export const isActivitiesFilterActive = (parentId) =>
  parentId != null && parentId !== "";

export const getActivitiesEmptyMessage = (parentId, dependents) => {
  if (parentId == null || parentId === "") {
    return "Faça uma recarga para começar a usar os cartões";
  }

  const name = getActivitiesFilterName(parentId, dependents);
  return `Faça uma recarga para ${name} usar seu cartão`;
};
