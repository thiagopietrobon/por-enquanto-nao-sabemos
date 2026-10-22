<script setup lang="ts">
import { computed } from 'vue'
import { useFiltrosStore } from '../filtrosStore'
import type { Filtros } from '../derivar'

const store = useFiltrosStore()

const temFiltroAtivo = computed(() => {
  return store.busca.trim() !== '' || store.status !== 'todos' || store.prioridade !== 'todas'
})

function aoDigitarBusca(event: Event) {
  const alvo = event.target as HTMLInputElement
  store.alterar({ busca: alvo.value })
}

function aoMudarStatus(event: Event) {
  const alvo = event.target as HTMLSelectElement
  store.alterar({ status: alvo.value as Filtros['status'] })
}

function aoMudarPrioridade(event: Event) {
  const alvo = event.target as HTMLSelectElement
  store.alterar({ prioridade: alvo.value as Filtros['prioridade'] })
}
</script>

<template>
  <section class="barra-filtros" aria-label="Filtros de tarefas">
    <div class="campo-filtro campo-busca">
      <label for="filtro-busca" class="filtro-rotulo">Buscar por título</label>
      <div class="input-com-icone">
        <span class="icone-busca" aria-hidden="true">🔍</span>
        <input
          id="filtro-busca"
          type="search"
          placeholder="Digite o título da tarefa..."
          :value="store.busca"
          @input="aoDigitarBusca"
        />
      </div>
    </div>

    <div class="campo-filtro">
      <label for="filtro-status" class="filtro-rotulo">Status</label>
      <select
        id="filtro-status"
        :value="store.status"
        @change="aoMudarStatus"
      >
        <option value="todos">Todos os status</option>
        <option value="a-fazer">A fazer</option>
        <option value="em-andamento">Em andamento</option>
        <option value="em-revisao">Em revisão</option>
        <option value="concluida">Concluída</option>
      </select>
    </div>

    <div class="campo-filtro">
      <label for="filtro-prioridade" class="filtro-rotulo">Prioridade</label>
      <select
        id="filtro-prioridade"
        :value="store.prioridade"
        @change="aoMudarPrioridade"
      >
        <option value="todas">Todas as prioridades</option>
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
      </select>
    </div>

    <div v-if="temFiltroAtivo" class="campo-filtro acao-limpar">
      <button
        type="button"
        class="botao-limpar-filtros"
        @click="store.limpar"
        title="Limpar todos os filtros"
      >
        ✕ Limpar filtros
      </button>
    </div>
  </section>
</template>

<style scoped>
.barra-filtros {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  flex-wrap: wrap;
  padding: 18px 20px;
  margin-bottom: 24px;
  background: var(--branco);
  border: 1px solid var(--borda);
  border-radius: 14px;
  box-shadow: 0 4px 14px rgb(22 48 75 / 3%);
}

.campo-filtro {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 170px;
}

.campo-busca {
  flex: 2;
  min-width: 240px;
}

.filtro-rotulo {
  font-size: 13px;
  font-weight: 700;
  color: var(--azul-escuro);
}

.input-com-icone {
  position: relative;
  display: flex;
  align-items: center;
}

.icone-busca {
  position: absolute;
  left: 12px;
  font-size: 13px;
  pointer-events: none;
  opacity: 0.6;
}

.input-com-icone input {
  padding-left: 36px;
}

.campo-filtro input,
.campo-filtro select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--borda);
  border-radius: 9px;
  background: #fbfcfe;
  color: #1d2b3a;
  outline: none;
  font-size: 14px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.campo-filtro input:focus,
.campo-filtro select:focus {
  border-color: var(--azul);
  background: var(--branco);
  box-shadow: 0 0 0 3px rgb(37 99 166 / 12%);
}

.acao-limpar {
  flex: 0 0 auto;
  min-width: auto;
}

.botao-limpar-filtros {
  padding: 10px 14px;
  border: 1px solid #dce8f6;
  border-radius: 9px;
  background: var(--azul-claro);
  color: var(--azul);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;
}

.botao-limpar-filtros:hover {
  background: #d8e8f8;
  color: var(--azul-escuro);
}

@media (max-width: 700px) {
  .barra-filtros {
    flex-direction: column;
    align-items: stretch;
  }

  .campo-filtro,
  .campo-busca,
  .acao-limpar {
    width: 100%;
  }

  .botao-limpar-filtros {
    width: 100%;
    text-align: center;
  }
}
</style>
