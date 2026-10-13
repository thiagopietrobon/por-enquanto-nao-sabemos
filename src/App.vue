<script setup lang="ts">
  
import { ref, onMounted } from 'vue'
import type { Tarefa } from './tipos'
import CartaoTarefa from './components/CartaoTarefa.vue'

const tarefas = ref<Tarefa[]>([])


async function buscarTarefas() {
  const resposta = await fetch('http://localhost:3000/tarefas')
  tarefas.value = await resposta.json()
}

onMounted(() => {
  buscarTarefas()
})

</script>

<template>
  <main>
    <h1>Lista de tarefas</h1>

    <section>
      <CartaoTarefa
        v-for="tarefa in tarefas"
        :key="tarefa.id"
        :tarefa="tarefa"
      />
    </section>
  </main>
</template>

<style scoped>
/* Estilos específicos deste componente */
</style>