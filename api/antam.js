import axios from "axios";

export default async function handler(req, res) {
  try {
    // 1️⃣ Harga emas dunia (USD / oz)
    const goldRes = await axios.get(
      "https://api.metals.live/v1/spot/gold",
      { timeout: 10000 }
    );

    const goldUsdPerOz = goldRes.data[0][1];

    // 2️⃣ Kurs USD → IDR
    const kursRes = await axios.get(
      "https://api.frankfurter.app/latest?from=USD&to=IDR",
      { timeout: 10000 }
    );

    const usdToIdr = kursRes.data.rates.IDR;

    // 3️⃣ Konversi ke gram
    const usdPerGram = goldUsdPerOz / 31.1035;
    const idrPerGram = Math.round(usdPerGram * usdToIdr);

    return res.status(200).json({
      status: "success",
      source: {
        gold: "metals.live",
        forex: "frankfurter.app"
      },
      gold: {
        usd_per_oz: goldUsdPerOz,
        usd_per_gram: Number(usdPerGram.toFixed(2)),
        idr_per_gram: idrPerGram
      },
      currency: {
        usd_idr: usdToIdr
      },
      timestamp: goldRes.data[0][2]
    });
  } catch (error) {
    return res.status(200).json({
      status: "fallback",
      message: "Gagal mengambil data emas realtime",
      error: error.message
    });
  }
}
