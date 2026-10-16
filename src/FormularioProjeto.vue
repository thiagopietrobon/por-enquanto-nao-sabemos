<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const rota = useRoute()

const modoEdicao = computed(() => Boolean(rota.params.id))
</script>


<template>
  <main>
    <h1>{{ modoEdicao ? 'Editar projeto' : 'Novo projeto' }}</h1>

    <form>
      <div>
        <label for="nome">Nome do projeto</label>
        <input
          id="nome"
          type="text"
          required
        />
      </div>

      <div>
        <label for="descricao">Descrição</label>
        <textarea
          id="descricao"
          required
        ></textarea>
      </div>

      <div>
        <label for="disciplina">Disciplina</label>
        <input
          id="disciplina"
          type="text"
          required
        />
      </div>

      <button type="submit">Salvar projeto</button>
    </form>
  </main>
</template>
