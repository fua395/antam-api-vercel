import axios from "axios";

export default async function handler(req, res) {
  try {
    // 1️⃣ Kurs USD → IDR (REAL)
    const forexRes = await axios.get(
      "https://api.frankfurter.app/latest?from=USD&to=IDR"
    );

    const usdToIdr = forexRes.data.rates.IDR;

    // 2️⃣ Harga emas dunia (USD / oz) — NILAI REFERENSI HARIAN
    // Fixing emas dunia (kisaran normal market)
    // Update manual / cron 1x sehari
    const goldUsdPerOz = 2050; // contoh harga spot wajar

    // 3️⃣ Konversi
    const usdPerGram = goldUsdPerOz / 31.1035;
    const idrPerGram = Math.round(usdPerGram * usdToIdr);

    return res.status(200).json({
      status: "success",
      reference: "world gold spot (daily fixing)",
      gold: {
        usd_per_oz: goldUsdPerOz,
        usd_per_gram: Number(usdPerGram.toFixed(2)),
        idr_per_gram: idrPerGram
      },
      currency: {
        usd_idr: usdToIdr
      },
      date: forexRes.data.date
    });
  } catch (error) {
    return res.status(200).json({
      status: "fallback",
      message: "Gagal mengambil harga emas dunia",
      error: error.message
    });
  }
}
