<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { buscarTarefa as buscarTarefaApi, ErroApi } from './api'
import type { Tarefa } from './tipos'
import { formatarData } from './utils'

const rota = useRoute()
const tarefa = ref<Tarefa | null>(null)
const carregando = ref(false)
const erro = ref('')
const idTarefa = computed(() => String(rota.params.id ?? ''))
let requisicaoAtual = 0

async function buscarTarefa(id: string) {
  const numeroRequisicao = ++requisicaoAtual
  tarefa.value = null
  erro.value = ''
  carregando.value = true

  try {
    const dadosTarefa = await buscarTarefaApi(id)
    if (numeroRequisicao !== requisicaoAtual) return
    tarefa.value = dadosTarefa
  } catch (erroBusca) {
    if (numeroRequisicao !== requisicaoAtual) return
    if (erroBusca instanceof ErroApi && erroBusca.status === 404) {
      erro.value = `Nenhuma tarefa foi encontrada com o ID ${id}.`
      return
    }
    erro.value = erroBusca instanceof Error
      ? erroBusca.message
      : 'Ocorreu um erro ao consultar a tarefa.'
  } finally {
    if (numeroRequisicao === requisicaoAtual) carregando.value = false
  }
}

watch(idTarefa, buscarTarefa, { immediate: true })

</script>

<template>
  <section class="pagina pagina-detalhe">
    <RouterLink class="link-voltar" to="/">← Voltar para tarefas</RouterLink>
    <div class="titulo-pagina">
      <p class="sobretitulo">DETALHES</p>
      <h1>Detalhe da tarefa</h1>
      <p class="texto-introdutorio">Todas as informações cadastradas para esta atividade.</p>
    </div>

    <p v-if="carregando" class="mensagem" role="status">Buscando tarefa...</p>
    <p v-else-if="erro" class="mensagem mensagem-erro" role="alert">{{ erro }} Verifique se o json-server está rodando
      na porta 3000.</p>

    <article v-else-if="tarefa" class="painel-detalhes">
      <div class="painel-titulo">
        <span class="etiqueta">Tarefa #{{ tarefa.id }}</span>
        <h2>{{ tarefa.titulo }}</h2>
      </div>
      <dl class="lista-detalhes">
        <div class="item-detalhe">
          <dt>ID</dt>
          <dd>{{ tarefa.id }}</dd>
        </div>
        <div class="item-detalhe">
          <dt>ID do projeto</dt>
          <dd>{{ tarefa.projetoId }}</dd>
        </div>
        <div class="item-detalhe item-detalhe-largo">
          <dt>Título</dt>
          <dd>{{ tarefa.titulo }}</dd>
        </div>
        <div class="item-detalhe item-detalhe-largo">
          <dt>Descrição</dt>
          <dd>{{ tarefa.descricao || 'Não informada' }}</dd>
        </div>
        <div class="item-detalhe">
          <dt>Status</dt>
          <dd>{{ tarefa.status }}</dd>
        </div>
        <div class="item-detalhe">
          <dt>Prioridade</dt>
          <dd>{{ tarefa.prioridade }}</dd>
        </div>
        <div class="item-detalhe">
          <dt>Responsável</dt>
          <dd>{{ tarefa.responsavel || 'Não informado' }}</dd>
        </div>
        <div class="item-detalhe">
          <dt>Prazo</dt>
          <dd>{{ formatarData(tarefa.prazo) }}</dd>
        </div>
      </dl>
      <RouterLink class="botao-link" :to="{ name: 'editar-tarefa', params: { id: tarefa.id } }">
        Editar tarefa
      </RouterLink>
      <RouterLink class="botao-link" :to="{ name: 'detalhe-projeto', params: { id: tarefa.projetoId } }">
        Ver projeto relacionado
      </RouterLink>
    </article>
  </section>
</template>
