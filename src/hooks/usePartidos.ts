import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { partidosService } from '../services/partidos.service'

export const usePartidos = () => {
  const query = useQuery({
    queryKey: ['partidos'],
    queryFn: () => partidosService.listar(),
  })

  const partidos = computed(() => query.data.value ?? [])

  return {
    ...query,
    partidos,
  }
}
