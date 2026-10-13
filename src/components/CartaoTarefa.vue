<script setup lang="ts">
import type { Tarefa } from '../tipos'
import { formatarData } from '../utils'

defineProps<{
  tarefa: Tarefa
}>()

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

<style scoped>
.cartao-tarefa h2 {
  margin: 15px 0 9px;
  font-size: 20px;
  line-height: 1.35;
}

.cartao-descricao {
  margin: 0;
  color: var(--texto-suave);
  line-height: 1.6;
}

.cartao-etiquetas {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.etiqueta-status {
  background: #eef6ff;
}

.etiqueta-prioridade {
  background: #fbf7ec;
  border-color: #f1e5c6;
  color: #89651b;
}

.cartao-metadados {
  width: 100%;
  margin-top: auto;
  padding-top: 15px;
}

.cartao-metadados p {
  margin: 5px 0;
  color: #536579;
  font-size: 13px;
}

@media (max-width: 420px) {
  .cartao-tarefa {
    padding: 18px;
  }
}
</style>
