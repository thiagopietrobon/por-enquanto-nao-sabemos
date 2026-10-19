<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  atualizarTarefa,
  buscarTarefa,
  criarTarefa,
  listarProjetos,
} from './api'
import type {
  NovaTarefa,
  Prioridade,
  Projeto,
  Status,
  Tarefa,
} from './tipos'

const rota = useRoute()
const router = useRouter()

const modoEdicao = computed(() => Boolean(rota.params.id))
const idTarefa = computed(() => String(rota.params.id ?? ''))

const projetos = ref<Projeto[]>([])
const carregando = ref(true)
const salvando = ref(false)
const erro = ref('')
const erroCarregamento = ref(false)

const projetoId = ref(String(rota.query.projetoId ?? ''))
const titulo = ref('')
const descricao = ref('')
const status = ref<Status>('a-fazer')
const prioridade = ref<Prioridade>('media')
const responsavel = ref('')
const prazo = ref('')

let requisicaoAtual = 0

function preencherFormulario(tarefa: Tarefa) {
  projetoId.value = tarefa.projetoId
  titulo.value = tarefa.titulo
  descricao.value = tarefa.descricao
  status.value = tarefa.status
  prioridade.value = tarefa.prioridade
  responsavel.value = tarefa.responsavel
  prazo.value = tarefa.prazo
}

function limparFormulario() {
  projetoId.value = String(rota.query.projetoId ?? '')
  titulo.value = ''
  descricao.value = ''
  status.value = 'a-fazer'
  prioridade.value = 'media'
  responsavel.value = ''
  prazo.value = ''
}

async function carregarFormulario() {
  const numeroRequisicao = ++requisicaoAtual

  carregando.value = true
  erro.value = ''
  erroCarregamento.value = false

  try {
    projetos.value = await listarProjetos()

    if (numeroRequisicao !== requisicaoAtual) return

    if (modoEdicao.value) {
      const tarefa = await buscarTarefa(idTarefa.value)

      if (numeroRequisicao !== requisicaoAtual) return

      preencherFormulario(tarefa)
    } else {
      limparFormulario()

      // Seleciona automaticamente quando existe apenas um projeto.
      if (!projetoId.value && projetos.value.length === 1) {
        projetoId.value = projetos.value[0].id
      }
    }
  } catch (erroBusca) {
    if (numeroRequisicao !== requisicaoAtual) return

    erroCarregamento.value = true

    erro.value = erroBusca instanceof Error
      ? erroBusca.message
      : 'Não foi possível carregar os dados do formulário.'
  } finally {
    if (numeroRequisicao === requisicaoAtual) {
      carregando.value = false
    }
  }
}

watch(
  [idTarefa, () => String(rota.query.projetoId ?? '')],
  carregarFormulario,
  { immediate: true },
)

async function salvarTarefa() {
  if (salvando.value) return

  if (!projetoId.value) {
    erro.value = 'Selecione um projeto para vincular esta tarefa.'
    return
  }

  salvando.value = true
  erro.value = ''

  const dadosTarefa: NovaTarefa = {
    projetoId: projetoId.value,
    titulo: titulo.value.trim(),
    descricao: descricao.value.trim(),
    status: status.value,
    prioridade: prioridade.value,
    responsavel: responsavel.value.trim(),
    prazo: prazo.value,
  }

  try {
    if (modoEdicao.value) {
      await atualizarTarefa(idTarefa.value, dadosTarefa)

      await router.push({
        name: 'detalhe-tarefa',
        params: { id: idTarefa.value },
      })
    } else {
      await criarTarefa(dadosTarefa)
      await router.push('/')
    }
  } catch (erroSalvar) {
    erro.value = erroSalvar instanceof Error
      ? erroSalvar.message
      : 'Não foi possível salvar a tarefa. Verifique se a API está ativa.'
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <main class="pagina">
    <RouterLink class="link-voltar" :to="modoEdicao
      ? { name: 'detalhe-tarefa', params: { id: idTarefa } }
      : '/'">
      ← {{ modoEdicao ? 'Voltar para tarefa' : 'Voltar para tarefas' }}
    </RouterLink>

    <div class="titulo-pagina">
      <p class="sobretitulo">
        {{ modoEdicao ? 'ATUALIZAÇÃO' : 'NOVA ATIVIDADE' }}
      </p>

      <h1>{{ modoEdicao ? 'Editar tarefa' : 'Nova tarefa' }}</h1>

      <p class="texto-introdutorio">
        {{
          modoEdicao
            ? 'Atualize as informações desta atividade.'
            : 'Preencha os campos abaixo para cadastrar uma nova atividade.'
        }}
      </p>
    </div>

    <p v-if="carregando" class="mensagem" role="status">
      Carregando dados do formulário...
    </p>

    <section v-else-if="erroCarregamento" class="mensagem mensagem-erro" role="alert">
      <p>{{ erro }}</p>

      <RouterLink class="botao-secundario" :to="{ name: 'tarefas' }">
        Voltar para tarefas
      </RouterLink>
    </section>

    <form v-else class="formulario-tarefa" @submit.prevent="salvarTarefa">
      <p v-if="erro" class="mensagem mensagem-erro" role="alert">
        {{ erro }}
      </p>

      <p v-if="projetos.length === 0" class="mensagem" role="status">
        Nenhum projeto cadastrado. Cadastre um projeto antes de criar uma tarefa.
      </p>

      <div class="formulario-campo">
        <label for="projetoId">Projeto vinculado *</label>

        <select id="projetoId" v-model="projetoId" required :disabled="projetos.length === 0 || salvando">
          <option value="" disabled>Selecione um projeto</option>

          <option v-for="projeto in projetos" :key="projeto.id" :value="projeto.id">
            Projeto #{{ projeto.id }} — {{ projeto.nome }} ({{ projeto.disciplina }})
          </option>
        </select>
      </div>

      <div class="formulario-campo">
        <label for="titulo">Título da tarefa *</label>

        <input id="titulo" v-model="titulo" type="text" maxlength="150" placeholder="Ex.: Desenvolver tela de listagem"
          required :disabled="salvando" />
      </div>

      <div class="formulario-campo">
        <label for="descricao">Descrição</label>

        <textarea id="descricao" v-model="descricao" placeholder="Descreva as instruções ou requisitos desta tarefa..."
          :disabled="salvando"></textarea>
      </div>

      <div class="formulario-linha">
        <div class="formulario-campo">
          <label for="status">Status *</label>

          <select id="status" v-model="status" required :disabled="salvando">
            <option value="a-fazer">A fazer</option>
            <option value="em-andamento">Em andamento</option>
            <option value="em-revisao">Em revisão</option>
            <option value="concluida">Concluída</option>
          </select>
        </div>

        <div class="formulario-campo">
          <label for="prioridade">Prioridade *</label>

          <select id="prioridade" v-model="prioridade" required :disabled="salvando">
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      <div class="formulario-linha">
        <div class="formulario-campo">
          <label for="responsavel">Responsável</label>

          <input id="responsavel" v-model="responsavel" type="text" placeholder="Nome do integrante responsável"
            :disabled="salvando" />
        </div>

        <div class="formulario-campo">
          <label for="prazo">Prazo de conclusão *</label>

          <input id="prazo" v-model="prazo" type="date" required :disabled="salvando" />
        </div>
      </div>

      <div class="formulario-acoes">
        <button type="submit" class="botao" :disabled="salvando || projetos.length === 0">
          {{
            salvando
              ? 'Salvando...'
              : modoEdicao
                ? 'Salvar alterações'
                : 'Salvar tarefa'
          }}
        </button>

        <RouterLink class="botao-secundario" :to="modoEdicao
          ? { name: 'detalhe-tarefa', params: { id: idTarefa } }
          : '/'">
          Cancelar
        </RouterLink>
      </div>
    </form>
  </main>
</template>
