<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listarTarefas } from './api'
import type { Tarefa } from './tipos'
import CartaoTarefa from './components/CartaoTarefa.vue'

const tarefas = ref<Tarefa[]>([])
const carregando = ref(true)
const erro = ref('')

async function buscarTarefas() {
  carregando.value = true
  erro.value = ''

  try {
    tarefas.value = await listarTarefas()
  } catch (erroBusca) {
    erro.value = erroBusca instanceof Error
      ? erroBusca.message
      : 'Ocorreu um erro ao carregar as tarefas.'
  } finally {
    carregando.value = false
  }
}

onMounted(buscarTarefas)
</script>

<template>
  <section class="pagina">
    <div class="titulo-pagina">
      <p class="sobretitulo">ORGANIZAÇÃO</p>
      <h1>Tarefas</h1>
      <p class="texto-introdutorio">Acompanhe as atividades e consulte os detalhes de cada tarefa.</p>
    </div>

    <p v-if="carregando" class="mensagem" role="status">Carregando tarefas...</p>
    <p v-else-if="erro" class="mensagem mensagem-erro" role="alert">{{ erro }} Verifique se o json-server está rodando na porta 3000.</p>
    <div v-else-if="tarefas.length === 0" class="mensagem">Nenhuma tarefa cadastrada.</div>
    <section v-else class="grade-cartoes" aria-label="Lista de tarefas">
      <CartaoTarefa v-for="tarefa in tarefas" :key="tarefa.id" :tarefa="tarefa" />
    </section>
  </section>
</template>
