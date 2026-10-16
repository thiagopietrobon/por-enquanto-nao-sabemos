
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buscarProjeto, criarProjeto } from './api'
import type { Projeto } from './tipos'

const rota = useRoute()
const router = useRouter()

const modoEdicao = computed(() => Boolean(rota.params.id))

const nome = ref('')
const descricao = ref('')
const disciplina = ref('')

const carregando = ref(false)
const salvando = ref(false)
const erro = ref('')

onMounted(async () => {
  if (!modoEdicao.value) {
    return
  }

  carregando.value = true

  try {
    const projeto = await buscarProjeto(String(rota.params.id))

    nome.value = projeto.nome
    descricao.value = projeto.descricao
    disciplina.value = projeto.disciplina
  } catch {
    erro.value = 'Não foi possível carregar o projeto.'
  } finally {
    carregando.value = false
  }
})
</script>


async function salvarProjeto() {
  salvando.value = true
  erro.value = ''

  const dadosProjeto = {
    nome: nome.value,
    descricao: descricao.value,
    disciplina: disciplina.value,
    criadoEm: new Date().toISOString(),
  }

  try {
    if (modoEdicao.value) {
      // A edição será implementada no próximo ajuste.
      return
    }

    await criarProjeto(dadosProjeto)
    await router.push('/projetos')
  } catch {
    erro.value = 'Não foi possível salvar o projeto.'
  } finally {
    salvando.value = false
  }
}


<template>
  <main>
    <h1>{{ modoEdicao ? 'Editar projeto' : 'Novo projeto' }}</h1>

    <form>
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

      <button type="submit">Salvar projeto</button>
    </form>
  </main>
</template>
