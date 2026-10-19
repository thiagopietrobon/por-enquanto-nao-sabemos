<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { criarTarefa, listarProjetos } from './api'
import type { NovaTarefa, Prioridade, Projeto, Status } from './tipos'

const rota = useRoute()
const router = useRouter()

const projetos = ref<Projeto[]>([])
const carregandoProjetos = ref(true)
const salvando = ref(false)
const erro = ref('')

const projetoId = ref(String(rota.query.projetoId ?? ''))
const titulo = ref('')
const descricao = ref('')
const status = ref<Status>('a-fazer')
const prioridade = ref<Prioridade>('media')
const responsavel = ref('')
const prazo = ref('')

onMounted(async () => {
  carregandoProjetos.value = true
  try {
    projetos.value = await listarProjetos()

    // Se veio um ID de projeto na query da rota, mantém selecionado
    if (rota.query.projetoId) {
      projetoId.value = String(rota.query.projetoId)
    } else if (projetos.value.length === 1) {
      projetoId.value = projetos.value[0].id
    }
  } catch {
    erro.value = 'Não foi possível carregar a lista de projetos.'
  } finally {
    carregandoProjetos.value = false
  }
})

async function salvarTarefa() {
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
    await criarTarefa(dadosTarefa)
    await router.push('/')
  } catch {
    erro.value = 'Não foi possível salvar a tarefa. Verifique se o servidor está ativo.'
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <main class="pagina">
    <RouterLink class="link-voltar" to="/">← Voltar para tarefas</RouterLink>

    <div class="titulo-pagina">
      <p class="sobretitulo">NOVA ATIVIDADE</p>
      <h1>Nova tarefa</h1>
      <p class="texto-introdutorio">Preencha os campos abaixo para cadastrar uma nova atividade.</p>
    </div>

    <p v-if="carregandoProjetos" class="mensagem" role="status">Carregando formulário...</p>
    <p v-else-if="erro && projetos.length === 0" class="mensagem mensagem-erro" role="alert">{{ erro }}</p>

    <form v-else class="formulario-tarefa" @submit.prevent="salvarTarefa">
      <p v-if="erro" class="mensagem mensagem-erro" role="alert">{{ erro }}</p>

      <div class="formulario-campo">
        <label for="projetoId">Projeto vinculado *</label>
        <select id="projetoId" v-model="projetoId" required>
          <option value="" disabled>Selecione um projeto</option>
          <option v-for="projeto in projetos" :key="projeto.id" :value="projeto.id">
            Projeto #{{ projeto.id }} — {{ projeto.nome }} ({{ projeto.disciplina }})
          </option>
        </select>
      </div>

      <div class="formulario-campo">
        <label for="titulo">Título da tarefa *</label>
        <input
          id="titulo"
          v-model="titulo"
          type="text"
          placeholder="Ex.: Desenvolver tela de listagem"
          required
        />
      </div>

      <div class="formulario-campo">
        <label for="descricao">Descrição</label>
        <textarea
          id="descricao"
          v-model="descricao"
          placeholder="Descreva as instruções ou requisitos desta tarefa..."
        ></textarea>
      </div>

      <div class="formulario-linha">
        <div class="formulario-campo">
          <label for="status">Status *</label>
          <select id="status" v-model="status" required>
            <option value="a-fazer">A fazer</option>
            <option value="em-andamento">Em andamento</option>
            <option value="em-revisao">Em revisão</option>
            <option value="concluida">Concluída</option>
          </select>
        </div>

        <div class="formulario-campo">
          <label for="prioridade">Prioridade *</label>
          <select id="prioridade" v-model="prioridade" required>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      <div class="formulario-linha">
        <div class="formulario-campo">
          <label for="responsavel">Responsável</label>
          <input
            id="responsavel"
            v-model="responsavel"
            type="text"
            placeholder="Nome do integrante responsável"
          />
        </div>

        <div class="formulario-campo">
          <label for="prazo">Prazo de conclusão *</label>
          <input
            id="prazo"
            v-model="prazo"
            type="date"
            required
          />
        </div>
      </div>

      <div class="formulario-acoes">
        <button type="submit" class="botao" :disabled="salvando">
          {{ salvando ? 'Salvando...' : 'Salvar tarefa' }}
        </button>
        <RouterLink to="/" class="botao-secundario">Cancelar</RouterLink>
      </div>
    </form>
  </main>
</template>
