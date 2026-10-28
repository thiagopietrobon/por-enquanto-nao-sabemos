<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { filtrarTarefas } from './derivar'
import { useFiltrosStore } from './filtrosStore'
import CartaoTarefa from './components/CartaoTarefa.vue'
import BarraFiltros from './components/BarraFiltros.vue'
import { useTarefas } from './composables/useTarefas'
import AlternadorVisaoTarefas from './components/AlternadorVisaoTarefas.vue'

const {
  tarefas,
  carregando,
  erroCarregamento,
  erroAtualizacao,
  buscarTarefas,
  mudarStatusTarefa,
} = useTarefas()

const storeFiltros = useFiltrosStore()


const tarefasFiltradas = computed(() => {
  return filtrarTarefas(tarefas.value, storeFiltros)
})

onMounted(buscarTarefas)
</script>

<template>
  <section class="pagina">
    <div class="titulo-pagina">
      <p class="sobretitulo">ORGANIZAÇÃO</p>
      <h1>Tarefas</h1>
      <p class="texto-introdutorio">Acompanhe as atividades e consulte os detalhes de cada tarefa.</p>

      <AlternadorVisaoTarefas visao-ativa="lista" />

        <RouterLink to="/tarefas/nova" class="botao">
          + Nova tarefa
        </RouterLink>

    </div>

    <!-- Barra de Filtros compartilhada via Pinia -->
    <BarraFiltros />
    
    <p v-if="erroAtualizacao" class="mensagem mensagem-erro" role="alert">
      {{ erroAtualizacao }}
    </p>
    
    <p v-if="carregando" class="mensagem" role="status">
      Carregando tarefas...
    </p>
    
    <p v-else-if="erroCarregamento" class="mensagem mensagem-erro" role="alert">
      {{ erroCarregamento }}
    </p>
    
    <div v-else-if="tarefas.length === 0" class="mensagem">
      Nenhuma tarefa cadastrada.
    </div>
    <div v-else-if="tarefasFiltradas.length === 0" class="mensagem mensagem-vazia">
      <p>Nenhuma tarefa encontrada com os filtros informados.</p>
      <button type="button" class="botao-secundario" @click="storeFiltros.limpar">
        Limpar filtros
      </button>
    </div>
    <section v-else class="grade-cartoes" aria-label="Lista de tarefas">
      <CartaoTarefa
        v-for="tarefa in tarefasFiltradas"
        :key="tarefa.id"
        :tarefa="tarefa"
        :ao-mudar-status="mudarStatusTarefa"      />
    </section>
  </section>
</template>

<style scoped>
.mensagem-vazia {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
