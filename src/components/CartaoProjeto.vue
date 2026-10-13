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
