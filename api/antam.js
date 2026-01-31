import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      "https://www.logammulia.com/id/harga-emas-hari-ini",
      {
        timeout: 10000,
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const $ = cheerio.load(response.data);

    const harga = $(".harga_table tbody tr")
      .first()
      .find("td")
      .eq(1)
      .text()
      .replace(/\D/g, "");

    const buyback = $(".harga_table tbody tr")
      .first()
      .find("td")
      .eq(2)
      .text()
      .replace(/\D/g, "");

    return res.status(200).json({
      status: "success",
      source: "logammulia.com",
      price: Number(harga),
      buyback: Number(buyback)
    });
  } catch (error) {
    return res.status(200).json({
      status: "fallback",
      message: "Scraping gagal",
      error: error.message
    });
  }
}
