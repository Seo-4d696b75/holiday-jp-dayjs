module.exports = async () => {
    // 1. set timezone
    process.env.TZ = "Asia/Tokyo"
    // 2. setup puppeteer
    await require("jest-environment-puppeteer/setup")()
}