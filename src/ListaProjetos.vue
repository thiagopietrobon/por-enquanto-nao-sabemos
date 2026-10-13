
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Projeto } from './tipos'
import CartaoProjeto from './components/CartaoProjeto.vue'

const projetos = ref<Projeto[]>([])

async function buscarProjetos() {
  const resposta = await fetch('http://localhost:3000/projetos')
  projetos.value = await resposta.json()
}

onMounted(() => {
  buscarProjetos()
})
</script>

<template>
  <main>
    <h1>Lista de projetos</h1>

    <section>
      <CartaoProjeto
        v-for="projeto in projetos"
        :key="projeto.id"
        :projeto="projeto"
      />
    </section>
  </main>
</template>
