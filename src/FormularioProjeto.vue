<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  buscarProjeto,
  criarProjeto,
  atualizarProjeto,
} from './api'

const rota = useRoute()
const router = useRouter()

const modoEdicao = computed(() => Boolean(rota.params.id))
const idProjeto = computed(() => String(rota.params.id ?? ''))

const nome = ref('')
const descricao = ref('')
const disciplina = ref('')
const criadoEm = ref('')

const carregando = ref(false)
const salvando = ref(false)
const erro = ref('')

onMounted(async () => {
  if (!modoEdicao.value) {
    return
  }

  carregando.value = true
  erro.value = ''

  try {
    const projeto = await buscarProjeto(String(rota.params.id))

    nome.value = projeto.nome
    descricao.value = projeto.descricao
    disciplina.value = projeto.disciplina
    criadoEm.value = projeto.criadoEm
  } catch {
    erro.value = 'Não foi possível carregar o projeto.'
  } finally {
    carregando.value = false
  }
})

async function salvarProjeto() {
  if (salvando.value) return
  
  salvando.value = true
  erro.value = ''

  const dadosProjeto = {
    nome: nome.value,
    descricao: descricao.value,
    disciplina: disciplina.value,
    criadoEm: modoEdicao.value
      ? criadoEm.value
      : new Date().toISOString(),
  }

  try {
    if (modoEdicao.value) {
      await atualizarProjeto(
        String(rota.params.id),
        dadosProjeto,
      )
    } else {
      await criarProjeto(dadosProjeto)
    }

    await router.push('/projetos')
  } catch {
    erro.value = 'Não foi possível salvar o projeto.'
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <section class="pagina">
    <RouterLink
      class="link-voltar"
      :to="modoEdicao
        ? { name: 'detalhe-projeto', params: { id: idProjeto } }
        : '/projetos'"
    >
      ← {{ modoEdicao ? 'Voltar para projeto' : 'Voltar para projetos' }}
    </RouterLink>

    <div class="titulo-pagina">
      <h1 id="titulo-formulario-projeto">
        {{ modoEdicao ? 'Editar projeto' : 'Novo projeto' }}
      </h1>
    </div>

    <p v-if="erro" class="mensagem mensagem-erro" role="alert">
      {{ erro }}
    </p>

    <p v-if="carregando"  class="mensagem" role="status" aria-live="polite">
      Carregando projeto...
    </p>

    <form
      v-else
      class="formulario-projeto"
      aria-labelledby="titulo-formulario-projeto"
      @submit.prevent="salvarProjeto"
    >
      <p id="projeto-campos-obrigatorios" class="texto-ajuda">
        Os campos marcados com * são obrigatórios.
      </p>

      <div class="formulario-campo">
          <label for="nome">Nome do projeto *</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            required
            :disabled="salvando"
            aria-describedby="projeto-campos-obrigatorios"
          />
      </div>

      <div class="formulario-campo">
          <label for="descricao">Descrição *</label>
          <textarea
            id="descricao"
            v-model="descricao"
            required
            :disabled="salvando"
            aria-describedby="projeto-campos-obrigatorios"
          ></textarea>
      </div>

      <div class="formulario-campo">
          <label for="disciplina">Disciplina *</label>
          <input
            id="disciplina"
            v-model="disciplina"
            type="text"
            required
            :disabled="salvando"
            aria-describedby="projeto-campos-obrigatorios"
          />
      </div>

      <div class="formulario-acoes">
        <button type="submit" class="botao" :disabled="salvando">
          {{ salvando ? 'Salvando...' : 'Salvar projeto' }}
        </button>
      </div>
    </form>
  </section>
</template>
