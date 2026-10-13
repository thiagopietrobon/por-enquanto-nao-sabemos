
<script setup lang="ts">
import type { Projeto } from '../tipos'

defineProps<{
  projeto: Projeto
}>()
</script>

<template>
  <article class="cartao-projeto">
    <h2>{{ projeto.nome }}</h2>
    <p>{{ projeto.descricao }}</p>
    <p>Disciplina: {{ projeto.disciplina }}</p>
  </article>
</template>
