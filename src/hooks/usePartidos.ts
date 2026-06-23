import { computed } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  partidosService,
  type ActualizarPartidoPayload,
} from "../services/partidos.service";

export const usePartidos = () => {
  const query = useQuery({
    queryKey: ["partidos"],
    queryFn: () => partidosService.listar(),
  });

  const partidos = computed(() => query.data.value ?? []);

  return {
    ...query,
    partidos,
  };
};

export const useUpdatePartido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ActualizarPartidoPayload;
    }) => partidosService.actualizar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["partidos"]})
    }
  });
};
