import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DependentController } from "@/controller";
import { QueryKeys } from "@/queries/@config";
import { appendDependentToList } from "@/sdk/dependent";

export const createDependent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }) =>
      (await DependentController.createDependent({ data })).data,
    onSuccess: (dependent) => {
      queryClient.setQueryData([QueryKeys.getDependents], (current) =>
        appendDependentToList(current, dependent),
      );
      queryClient.invalidateQueries({ queryKey: [QueryKeys.getDependents] });
    },
  });
};
