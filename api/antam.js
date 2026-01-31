import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      "https://api.exchangerate.host/latest?base=USD&symbols=IDR"
    );

    const rate = response.data.rates.IDR;

    return res.status(200).json({
      status: "success",
      source: "exchangerate.host",
      base: "USD",
      target: "IDR",
      rate: rate,
      date: response.data.date
    });
  } catch (error) {
    return res.status(200).json({
      status: "fallback",
      message: "Gagal mengambil kurs",
      error: error.message
    });
  }
}
