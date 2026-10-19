import type { Projeto, Tarefa } from "./tipos";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type ProjetoComTarefas = Projeto & {
    tarefas: Tarefa[];
};

export class ErroApi extends Error {
    readonly status: number;

    constructor(status: number, mensagem: string) {
        super(mensagem);
        this.status = status;
        this.name = "ErroApi";
    }
}


async function requisitar<T>(
    caminho: string,
    opcoes?: RequestInit,
): Promise<T> {
    const resposta = await fetch(`${API_URL}${caminho}`, opcoes);

    if (!resposta.ok) {
        throw new ErroApi(
            resposta.status,
            `A API respondeu com status ${resposta.status}.`,
        );
    }

    return (await resposta.json()) as T;
}


export function listarProjetos(): Promise<Projeto[]> {
    return requisitar<Projeto[]>("/projetos");
}

export function buscarProjeto(id: string): Promise<ProjetoComTarefas> {
    return requisitar<ProjetoComTarefas>(
        `/projetos/${encodeURIComponent(id)}?_embed=tarefas`,
    );
}

export async function criarTarefa(tarefa: Omit<Tarefa, "id">): Promise<Tarefa> {
    const tarefas = await listarTarefas();
    const idsNumericos = tarefas
        .map((t) => Number(t.id))
        .filter((n) => !Number.isNaN(n));
    const proximoId = idsNumericos.length > 0 ? String(Math.max(...idsNumericos) + 1) : "1";

    return requisitar<Tarefa>("/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: proximoId, ...tarefa }),
    });
}

export function atualizarTarefa(
    id: string,
    tarefa: Omit<Tarefa, "id">,
): Promise<Tarefa> {
    return requisitar<Tarefa>(`/tarefas/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tarefa),
    });
}

export async function criarProjeto(projeto: Omit<Projeto, "id">): Promise<Projeto> {
    const projetos = await listarProjetos();
    const idsNumericos = projetos
        .map((p) => Number(p.id))
        .filter((n) => !Number.isNaN(n));
    const proximoId = idsNumericos.length > 0 ? String(Math.max(...idsNumericos) + 1) : "1";

    return requisitar<Projeto>("/projetos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: proximoId, ...projeto }),
    });
}


export function atualizarProjeto(
    id: string,
    projeto: Omit<Projeto, "id">,
): Promise<Projeto> {
    return requisitar<Projeto>(`/projetos/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(projeto),
    });
}



export function listarTarefas(): Promise<Tarefa[]> {
    return requisitar<Tarefa[]>("/tarefas");
}

export function buscarTarefa(id: string): Promise<Tarefa> {
    return requisitar<Tarefa>(`/tarefas/${encodeURIComponent(id)}`);
}
