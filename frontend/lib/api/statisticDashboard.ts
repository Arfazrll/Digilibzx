export async function fetchStatisticDashboard(max: number) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/statistic?max=${max}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data statistik');
    }
    return response.json();
}
