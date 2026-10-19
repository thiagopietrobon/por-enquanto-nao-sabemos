export function formatarData(data?: string | null): string {
    if (!data || !data.trim()) return "Não informado";

    const texto = data.trim();

    // Se já estiver no padrão brasileiro DD/MM/AAAA
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
        return texto;
    }

    // Se for formato de data sem horário YYYY-MM-DD (ex.: prazos "2026-10-06")
    // Converte direto para evitar recuo de um dia decorrente do fuso horário UTC
    const matchDataSimples = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (matchDataSimples) {
        const [, ano, mes, dia] = matchDataSimples;
        return `${dia}/${mes}/${ano}`;
    }

    // Se for string ISO com data e horário (ex.: "2026-10-16T17:07:25.296Z")
    const dataObj = new Date(texto);
    if (!Number.isNaN(dataObj.getTime())) {
        return dataObj.toLocaleDateString("pt-BR");
    }

    return texto;
}