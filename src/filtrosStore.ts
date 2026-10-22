import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Filtros } from './derivar'

export const useFiltrosStore = defineStore('filtros', () => {
  const busca = ref('')
  const status = ref<Filtros['status']>('todos')
  const prioridade = ref<Filtros['prioridade']>('todas')

  function alterar(parcial: Partial<Filtros>) {
    if (parcial.busca !== undefined) {
      busca.value = parcial.busca
    }
    if (parcial.status !== undefined) {
      status.value = parcial.status
    }
    if (parcial.prioridade !== undefined) {
      prioridade.value = parcial.prioridade
    }
  }

  function limpar() {
    busca.value = ''
    status.value = 'todos'
    prioridade.value = 'todas'
  }

  return {
    busca,
    status,
    prioridade,
    alterar,
    limpar,
  }
})
