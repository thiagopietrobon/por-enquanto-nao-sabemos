import type { Projeto, Tarefa } from './tipos'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type ProjetoComTarefas = Projeto & {
  tarefas: Tarefa[]
}

export class ErroApi extends Error {
  readonly status: number

  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.status = status
    this.name = 'ErroApi'
  }
}

async function requisitar<T>(caminho: string): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`)

  if (!resposta.ok) {
    throw new ErroApi(resposta.status, `A API respondeu com status ${resposta.status}.`)
  }

  return (await resposta.json()) as T
}

export function listarProjetos(): Promise<Projeto[]> {
  return requisitar<Projeto[]>('/projetos')
}

export function buscarProjeto(id: string): Promise<ProjetoComTarefas> {
  return requisitar<ProjetoComTarefas>(
    `/projetos/${encodeURIComponent(id)}?_embed=tarefas`,
  )
}

export function listarTarefas(): Promise<Tarefa[]> {
  return requisitar<Tarefa[]>('/tarefas')
}

export function buscarTarefa(id: string): Promise<Tarefa> {
  return requisitar<Tarefa>(`/tarefas/${encodeURIComponent(id)}`)
}