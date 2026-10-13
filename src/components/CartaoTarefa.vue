<script setup lang="ts">
import type { Tarefa } from '../tipos'

defineProps<{
  tarefa: Tarefa
}>()

function formatarData(data: string) {
  if (!data) return 'Não informado'
  const partes = data.split('-')
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data
}
</script>

<template>
  <article class="cartao cartao-tarefa">
    <div class="cartao-etiquetas">
      <span class="etiqueta etiqueta-status">{{ tarefa.status }}</span>
      <span class="etiqueta etiqueta-prioridade">Prioridade: {{ tarefa.prioridade }}</span>
    </div>

    <h2>{{ tarefa.titulo }}</h2>
    <p class="cartao-descricao">{{ tarefa.descricao }}</p>

    <div class="cartao-metadados">
      <p><strong>Responsável:</strong> {{ tarefa.responsavel || 'Não informado' }}</p>
      <p><strong>Prazo:</strong> {{ formatarData(tarefa.prazo) }}</p>
    </div>

    <RouterLink class="link-detalhes" :to="{ name: 'detalhe-tarefa', params: { id: tarefa.id } }">
      Ver detalhes <span aria-hidden="true">→</span>
    </RouterLink>
  </article>
</template>
