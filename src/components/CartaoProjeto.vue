<script setup lang="ts">
import type { Projeto } from '../tipos'

defineProps<{
  projeto: Projeto
}>()
</script>

<template>
  <article class="cartao cartao-projeto">
    <span class="etiqueta">Projeto #{{ projeto.id }}</span>
    <h2>{{ projeto.nome }}</h2>
    <p class="cartao-descricao">{{ projeto.descricao }}</p>
    <p class="cartao-disciplina"><strong>Disciplina:</strong> {{ projeto.disciplina }}</p>
    <RouterLink class="link-detalhes" :to="{ name: 'detalhe-projeto', params: { id: projeto.id } }">
      Ver projeto <span aria-hidden="true">→</span>
    </RouterLink>
  </article>
</template>

<style scoped>
.cartao-projeto h2 {
  margin: 15px 0 9px;
  font-size: 20px;
  line-height: 1.35;
}

.cartao-descricao {
  margin: 0;
  color: var(--texto-suave);
  line-height: 1.6;
}

.cartao-disciplina {
  margin: 12px 0 5px;
  color: #536579;
  font-size: 13px;
}

@media (max-width: 420px) {
  .cartao-projeto {
    padding: 18px;
  }
}
</style>
