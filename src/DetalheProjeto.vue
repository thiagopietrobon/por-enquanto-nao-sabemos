<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { Projeto, Tarefa } from './tipos'
import CartaoTarefa from './components/CartaoTarefa.vue'

const rota = useRoute()
const projeto = ref<Projeto | null>(null)
const tarefas = ref<Tarefa[]>([])
const carregando = ref(false)
const erro = ref('')
const idProjeto = computed(() => String(rota.params.id ?? ''))

async function buscarProjeto(id: string) {
  projeto.value = null
  tarefas.value = []
  erro.value = ''
  carregando.value = true

  try {
    const [respostaProjeto, respostaTarefas] = await Promise.all([
      fetch(`http://localhost:3000/projetos/${encodeURIComponent(id)}`),
      fetch('http://localhost:3000/tarefas'),
    ])

    if (respostaProjeto.status === 404) {
      throw new Error(`Nenhum projeto foi encontrado com o ID ${id}.`)
    }
    if (!respostaProjeto.ok) {
      throw new Error('Não foi possível consultar os dados do projeto.')
    }
    if (!respostaTarefas.ok) {
      throw new Error('Não foi possível consultar as tarefas deste projeto.')
    }

    projeto.value = (await respostaProjeto.json()) as Projeto

    // Filtra no frontend usando o campo de vínculo definido no contrato: projetoId.
    // String() evita diferença entre IDs que cheguem como número ou texto.
    const todasTarefas = (await respostaTarefas.json()) as Tarefa[]
    tarefas.value = todasTarefas.filter(
      (tarefa) => String(tarefa.projetoId) === String(projeto.value?.id),
    )
  } catch (erroBusca) {
    erro.value = erroBusca instanceof Error
      ? erroBusca.message
      : 'Ocorreu um erro ao consultar o projeto.'
  } finally {
    carregando.value = false
  }
}

watch(idProjeto, buscarProjeto, { immediate: true })

function formatarData(data: string) {
  if (!data) return 'Não informado'
  const partes = data.split('-')
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data
}
</script>

<template>
  <section class="pagina pagina-detalhe">
    <RouterLink class="link-voltar" to="/projetos">← Voltar para projetos</RouterLink>
    <div class="titulo-pagina">
      <p class="sobretitulo">VISÃO DO PROJETO</p>
      <h1>Detalhe do projeto</h1>
      <p class="texto-introdutorio">Dados do projeto e atividades associadas a ele.</p>
    </div>

    <p v-if="carregando" class="mensagem" role="status">Buscando projeto e tarefas...</p>
    <p v-else-if="erro" class="mensagem mensagem-erro" role="alert">{{ erro }} Verifique se o json-server está rodando na porta 3000.</p>

    <template v-else-if="projeto">
      <section class="painel-detalhes">
        <div class="painel-titulo">
          <span class="etiqueta">Projeto #{{ projeto.id }}</span>
          <h2>{{ projeto.nome }}</h2>
        </div>
        <dl class="lista-detalhes">
          <div class="item-detalhe">
            <dt>ID</dt>
            <dd>{{ projeto.id }}</dd>
          </div>
          <div class="item-detalhe item-detalhe-largo">
            <dt>Nome</dt>
            <dd>{{ projeto.nome }}</dd>
          </div>
          <div class="item-detalhe item-detalhe-largo">
            <dt>Descrição</dt>
            <dd>{{ projeto.descricao || 'Não informada' }}</dd>
          </div>
          <div class="item-detalhe">
            <dt>Disciplina</dt>
            <dd>{{ projeto.disciplina }}</dd>
          </div>
          <div class="item-detalhe">
            <dt>Criado em</dt>
            <dd>{{ formatarData(projeto.criadoEm) }}</dd>
          </div>
        </dl>
      </section>

      <section class="secao-tarefas-projeto">
        <div class="cabecalho-secao">
          <div>
            <p class="sobretitulo">ATIVIDADES</p>
            <h2>Tarefas do projeto</h2>
          </div>
          <span class="contador">{{ tarefas.length }} {{ tarefas.length === 1 ? 'tarefa' : 'tarefas' }}</span>
        </div>

        <p v-if="tarefas.length === 0" class="mensagem">Este projeto ainda não possui tarefas vinculadas.</p>
        <div v-else class="grade-cartoes" aria-label="Tarefas deste projeto">
          <CartaoTarefa v-for="tarefa in tarefas" :key="tarefa.id" :tarefa="tarefa" />
        </div>
      </section>
    </template>
  </section>
</template>
