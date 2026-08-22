import { useRef, useState } from "react";

export const isSameStatus = (left, right) => {
  if (left == null && right == null) return true;
  if (left == null || right == null) return false;
  return String(left) === String(right);
};

export const useDepositsFilter = (selectedStatus = null) => {
  const [pendingStatus, setPendingStatus] = useState(selectedStatus ?? null);
  const pendingStatusRef = useRef(pendingStatus);
  pendingStatusRef.current = pendingStatus;

  const confirm = ({ onFilter, closeSheet } = {}) => {
    onFilter?.(pendingStatusRef.current);
    closeSheet?.();
  };

  const isSelected = (status) => isSameStatus(pendingStatusRef.current, status);

  return { pendingStatus, setPendingStatus, confirm, isSelected };
};
