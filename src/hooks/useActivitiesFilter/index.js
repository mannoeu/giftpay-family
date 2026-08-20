import { useRef, useState } from "react";

export const isSameParent = (left, right) => {
  if (left == null && right == null) return true;
  if (left == null || right == null) return false;
  return String(left) === String(right);
};

export const useActivitiesFilter = (selectedParentId = null) => {
  const [pendingParentId, setPendingParentId] = useState(
    selectedParentId ?? null,
  );
  const pendingParentIdRef = useRef(pendingParentId);
  pendingParentIdRef.current = pendingParentId;

  const confirm = ({ onFilter, closeSheet } = {}) => {
    onFilter?.(pendingParentIdRef.current);
    closeSheet?.();
  };

  const isSelected = (parentId) =>
    isSameParent(pendingParentIdRef.current, parentId);

  return { pendingParentId, setPendingParentId, confirm, isSelected };
};
