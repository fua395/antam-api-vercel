import axios from "axios";

export default async function handler(req, res) {
  try {
    // 1️⃣ Ambil kurs USD → IDR
    const kursResponse = await axios.get(
      "https://api.frankfurter.app/latest?from=USD&to=IDR",
      { timeout: 10000 }
    );

    const rate = kursResponse.data.rates.IDR;

    // 2️⃣ Harga emas dunia (USD / gram)
    // estimasi aman (bisa kamu ubah)
    const goldPriceUSD = 75;

    // 3️⃣ Konversi ke Rupiah
    const goldPriceIDR = Math.round(goldPriceUSD * rate);

    return res.status(200).json({
      status: "success",
      source: "frankfurter.app",
      currency: {
        base: "USD",
        target: "IDR",
        rate: rate
      },
      gold: {
        price_usd_per_gram: goldPriceUSD,
        price_idr_per_gram: goldPriceIDR
      },
      date: kursResponse.data.date
    });
  } catch (error) {
    return res.status(200).json({
      status: "fallback",
      message: "Gagal mengambil data kurs emas",
      error: error.message
    });
  }
}
