
<script setup lang="ts">
import type { Tarefa } from '../tipos'

defineProps<{
  tarefa: Tarefa
}>()
</script>

<template>
  <article class="cartao-tarefa">
    <h2>{{ tarefa.titulo }}</h2>

    <p>{{ tarefa.descricao }}</p>

    <p>Status: {{ tarefa.status }}</p>

    <p>Prioridade: {{ tarefa.prioridade }}</p>

    <p>Responsável: {{ tarefa.responsavel }}</p>

    <p>Prazo: {{ tarefa.prazo }}</p>
  </article>
</template>
