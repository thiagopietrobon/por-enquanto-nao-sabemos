import { createRouter, createWebHashHistory } from 'vue-router'
import ListaTarefas from './ListaTarefas.vue'
import ListaProjetos from './ListaProjetos.vue'
import DetalheTarefa from './DetalheTarefa.vue'
import DetalheProjeto from './DetalheProjeto.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'tarefas', component: ListaTarefas },
    { path: '/tarefas/:id', name: 'detalhe-tarefa', component: DetalheTarefa },
    { path: '/projetos', name: 'projetos', component: ListaProjetos },
    { path: '/projetos/:id', name: 'detalhe-projeto', component: DetalheProjeto },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
