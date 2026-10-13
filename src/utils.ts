export function formatarData(data: string) {
    if (!data) return "Não informado";

    const partes = data.split("-");
    return partes.length === 3
        ? `${partes[2]}/${partes[1]}/${partes[0]}`
        : data;
}