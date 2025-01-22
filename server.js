const express = require("express")
const fs = require("fs")
const path = require("path")
const cors = require("cors")
const JavaScriptObfuscator = require("javascript-obfuscator")
const ytSearch = require("yt-search")
const ytdl = require("@distube/ytdl-core")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const apiMetadata = {
  name: "combined-endpoint",
  version: "1.0.0",
  description: "A combined API for rizz, quotes, jokes, JavaScript obfuscation, YouTube search, and YouTube download.",
  creator: "BLUE DEMON",
  license: "MIT",
}

const requestFilePath = path.join(__dirname, "request.json")

function updateRequestCount(endpoint) {
  fs.readFile(requestFilePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading request.json:", err)
      return
    }

    const requestData = data ? JSON.parse(data) : { total: 0 }
    requestData[endpoint] = (requestData[endpoint] || 0) + 1
    requestData.total = (requestData.total || 0) + 1

    fs.writeFile(requestFilePath, JSON.stringify(requestData, null, 2), "utf8", (err) => {
      if (err) console.error("Error writing to request.json:", err)
    })
  })
}

app.get("/", (req, res) => {
  updateRequestCount("root")
  res.set("Content-Type", "application/json").send(
    JSON.stringify(
      {
        creator: "BLUE DEMON",
        status: 200,
        success: true,
        message: "Welcome to the Combined API!",
        metadata: apiMetadata,
      },
      null,
      2,
    ),
  )
})

app.get("/api/rizz", (req, res) => {
  updateRequestCount("rizz")
  const rizzPath = path.join(__dirname, "./jsonfiles/rizz.json")

  fs.readFile(rizzPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading rizz file:", err)
      return res.set("Content-Type", "application/json").send(
        JSON.stringify(
          {
            creator: "BLUE DEMON",
            status: 500,
            success: false,
            rizz: "Failed to load rizz lines.",
          },
          null,
          2,
        ),
      )
    }

    const rizz = JSON.parse(data)
    const randomIndex = Math.floor(Math.random() * rizz.length)
    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 200,
          success: true,
          rizz: rizz[randomIndex].rizz,
        },
        null,
        2,
      ),
    )
  })
})

app.get("/api/quote", (req, res) => {
  updateRequestCount("quote")
  const quotesPath = path.join(__dirname, "./jsonfiles/quotes.json")

  fs.readFile(quotesPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading quotes file:", err)
      return res.set("Content-Type", "application/json").send(
        JSON.stringify(
          {
            creator: "BLUE DEMON",
            status: 500,
            success: false,
            Author: null,
            quote: "Failed to load quotes.",
          },
          null,
          2,
        ),
      )
    }

    const quotes = JSON.parse(data)
    const randomIndex = Math.floor(Math.random() * quotes.length)
    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 200,
          success: true,
          Author: quotes[randomIndex].author,
          quote: quotes[randomIndex].quote,
        },
        null,
        2,
      ),
    )
  })
})

app.get("/api/joke", (req, res) => {
  updateRequestCount("joke")
  const jokesPath = path.join(__dirname, "./jsonfiles/jokes.json")

  fs.readFile(jokesPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading jokes file:", err)
      return res.set("Content-Type", "application/json").send(
        JSON.stringify(
          {
            creator: "BLUE DEMON",
            status: 500,
            success: false,
            joke: "Failed to load jokes.",
          },
          null,
          2,
        ),
      )
    }

    const jokes = JSON.parse(data)
    const randomIndex = Math.floor(Math.random() * jokes.length)
    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 200,
          success: true,
          joke: jokes[randomIndex].joke,
        },
        null,
        2,
      ),
    )
  })
})

app.get("/api/obf", (req, res) => {
  updateRequestCount("obfuscate")
  const code = req.query.code

  if (!code || typeof code !== "string") {
    return res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 400,
          success: false,
          message: "Invalid input code. Please provide JavaScript code as a 'code' query parameter.",
          "Obf-code": null,
        },
        null,
        2,
      ),
    )
  }

  try {
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      stringArray: true,
      stringArrayEncoding: ["base64"],
      stringArrayThreshold: 0.75,
    }).getObfuscatedCode()

    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 200,
          success: true,
          "Obf-code": obfuscatedCode,
        },
        null,
        2,
      ),
    )
  } catch (error) {
    console.error("Error obfuscating code:", error)
    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 500,
          success: false,
          message: "Failed to obfuscate the code.",
          "Obf-code": null,
        },
        null,
        2,
      ),
    )
  }
})

app.get("/api/yts", async (req, res) => {
  updateRequestCount("youtube-search")
  const query = req.query.q

  if (!query || typeof query !== "string") {
    return res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 400,
          success: false,
          message: "Invalid query. Please provide a search term using the 'q' query parameter.",
        },
        null,
        2,
      ),
    )
  }

  try {
    const results = await ytSearch(query)
    const videos = results.videos.slice(0, 5).map((video) => ({
      title: video.title,
      url: video.url,
      duration: video.timestamp,
      views: video.views,
      uploaded: video.ago,
      channel: {
        name: video.author.name,
        url: video.author.url,
      },
    }))

    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 200,
          success: true,
          query: query,
          results: videos,
        },
        null,
        2,
      ),
    )
  } catch (error) {
    console.error("Error performing YouTube search:", error)
    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 500,
          success: false,
          message: "Failed to perform YouTube search.",
          error: error.message,
        },
        null,
        2,
      ),
    )
  }
})

app.get("/api/ytdl", async (req, res) => {
  updateRequestCount("youtube-download")
  const url = req.query.url

  if (!url || typeof url !== "string") {
    return res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 400,
          success: false,
          message: "Invalid URL. Please provide a YouTube video URL using the 'url' query parameter.",
        },
        null,
        2,
      ),
    )
  }

  try {
    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, { quality: "highest" })

    if (!format) {
      throw new Error("No suitable format found")
    }

    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 200,
          success: true,
          title: info.videoDetails.title,
          downloadUrl: format.url,
          format: format.container,
          quality: format.qualityLabel,
        },
        null,
        2,
      ),
    )
  } catch (error) {
    console.error("Error downloading YouTube video:", error)
    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: "BLUE DEMON",
          status: 500,
          success: false,
          message: "Failed to download YouTube video.",
          error: error.message,
        },
        null,
        2,
      ),
    )
  }
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

