import axios from "axios";

export default async function handler(req, res) {
  try {
    // 1️⃣ Harga emas dunia (USD / oz)
    const goldRes = await axios.get(
      "https://api.metals.live/v1/spot/gold",
      { timeout: 10000 }
    );

    const goldUsdPerOz = goldRes.data[0][1];

    // validasi harga masuk akal
    if (goldUsdPerOz < 1000 || goldUsdPerOz > 5000) {
      throw new Error("Harga emas dunia tidak wajar");
    }

    // 2️⃣ Kurs USD → IDR
    const forexRes = await axios.get(
      "https://api.frankfurter.app/latest?from=USD&to=IDR",
      { timeout: 10000 }
    );

    const usdToIdr = forexRes.data.rates.IDR;

    // 3️⃣ Konversi ke gram
    const usdPerGram = goldUsdPerOz / 31.1035;
    const idrPerGram = Math.round(usdPerGram * usdToIdr);

    return res.status(200).json({
      status: "success",
      source: {
        gold: "metals.live (spot gold)",
        forex: "frankfurter.app (ECB)"
      },
      gold_world_price: {
        usd_per_oz: Number(goldUsdPerOz.toFixed(2)),
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
      message: "Gagal mengambil harga emas dunia",
      error: error.message
    });
  }
}
