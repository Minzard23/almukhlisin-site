//kumpulkan fungsi format yang dipakai di banyak halaman

//2500000 -> "Rp.2.500.000"
export const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(angka ?? 0)

//"2026-10-01" -> "Oktober 2026"
export const formatBulan = (tgl) =>
    new Date(tgl).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })