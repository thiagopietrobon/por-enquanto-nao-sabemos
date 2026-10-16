
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
  <main>
    <h1>{{ modoEdicao ? 'Editar projeto' : 'Novo projeto' }}</h1>

    <p v-if="erro" role="alert">
      {{ erro }}
    </p>

    <p v-if="carregando">
      Carregando projeto...
    </p>

    <form v-else @submit.prevent="salvarProjeto">
      <div>
        <label for="nome">Nome do projeto</label>
        <input
          id="nome"
          v-model="nome"
          type="text"
          required
        />
      </div>

      <div>
        <label for="descricao">Descrição</label>
        <textarea
          id="descricao"
          v-model="descricao"
          required
        ></textarea>
      </div>

      <div>
        <label for="disciplina">Disciplina</label>
        <input
          id="disciplina"
          v-model="disciplina"
          type="text"
          required
        />
      </div>

      <button type="submit" :disabled="salvando">
        {{ salvando ? 'Salvando...' : 'Salvar projeto' }}
      </button>
    </form>
  </main>
</template>
