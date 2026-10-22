import type { Tarefa, Status, Prioridade } from './tipos'

export interface Filtros {
  busca: string
  status: Status | 'todos'
  prioridade: Prioridade | 'todas'
}

export function filtrarTarefas(tarefas: Tarefa[], f: Filtros): Tarefa[] {
  const termo = f.busca.trim().toLocaleLowerCase('pt-BR')
  return tarefas.filter(
    (t) =>
      t.titulo.toLocaleLowerCase('pt-BR').includes(termo) &&
      (f.status === 'todos' || t.status === f.status) &&
      (f.prioridade === 'todas' || t.prioridade === f.prioridade),
  )
}

export const STATUS: Status[] = ['a-fazer', 'em-andamento', 'em-revisao', 'concluida']

export interface ColunaStatus {
  status: Status
  tarefas: Tarefa[]
}

export function agruparPorStatus(tarefas: Tarefa[]): ColunaStatus[] {
  return STATUS.map((status) => ({
    status,
    tarefas: tarefas.filter((t) => t.status === status),
  }))
}
