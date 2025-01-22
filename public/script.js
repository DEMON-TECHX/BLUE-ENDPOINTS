const apiSelect = document.getElementById("api-select")
const fetchDataButton = document.getElementById("fetch-data")
const apiInput = document.getElementById("api-input")
const resultContainer = document.getElementById("result-container")
const resultTitle = document.getElementById("result-title")
const resultContent = document.getElementById("result-content")

apiSelect.addEventListener("change", () => {
  const selectedApi = apiSelect.value
  if (
    selectedApi === "obf" ||
    selectedApi === "yts" ||
    selectedApi === "ytdl" ||
    selectedApi === "lyrics" ||
    selectedApi === "tiktok"
  ) {
    apiInput.style.display = "inline-block"
    apiInput.placeholder =
      selectedApi === "obf"
        ? "Enter JavaScript code to obfuscate"
        : selectedApi === "yts"
          ? "Enter YouTube search query"
          : selectedApi === "ytdl"
            ? "Enter YouTube video URL"
            : selectedApi === "lyrics"
              ? "Enter song title and artist"
              : "Enter TikTok video URL"
  } else {
    apiInput.style.display = "none"
  }
})

async function fetchData() {
  const selectedApi = apiSelect.value
  const inputValue = apiInput.value.trim()
  let url = `/api/${selectedApi}`

  if (selectedApi === "obf") {
    if (!inputValue) {
      alert("Please provide JavaScript code to obfuscate.")
      return
    }
    url += `?code=${encodeURIComponent(inputValue)}`
  } else if (selectedApi === "yts") {
    if (!inputValue) {
      alert("Please provide a YouTube search query.")
      return
    }
    url += `?q=${encodeURIComponent(inputValue)}`
  } else if (selectedApi === "ytdl") {
    if (!inputValue) {
      alert("Please provide a YouTube video URL.")
      return
    }
    url += `?url=${encodeURIComponent(inputValue)}`
  } else if (selectedApi === "lyrics") {
    if (!inputValue) {
      alert("Please provide a song title and artist.")
      return
    }
    url += `?q=${encodeURIComponent(inputValue)}`
  } else if (selectedApi === "tiktok") {
    if (!inputValue) {
      alert("Please provide a TikTok video URL.")
      return
    }
    url += `?url=${encodeURIComponent(inputValue)}`
  }

  try {
    resultContainer.style.display = "block"
    resultTitle.textContent = "Processing..."
    resultContent.textContent = "Please wait while we fetch the data..."

    const response = await fetch(url)
    const data = await response.json()

    switch (selectedApi) {
      case "joke":
        resultTitle.textContent = "Random Joke:"
        resultContent.textContent = data.joke || "No joke available."
        break
      case "quote":
        resultTitle.textContent = "Random Quote:"
        resultContent.textContent = `${data.quote} - ${data.Author}`
        break
      case "rizz":
        resultTitle.textContent = "Random Rizz:"
        resultContent.textContent = data.rizz || "No rizz available."
        break
      case "obf":
        resultTitle.textContent = "Obfuscated Code:"
        resultContent.innerHTML = `<pre>${data["Obf-code"] || "No code available."}</pre>`
        break
      case "yts":
        resultTitle.textContent = "YouTube Search Results:"
        resultContent.innerHTML = data.results
          .map(
            (video) => `
              <div>
                <strong>${video.title}</strong><br>
                <a href="${video.url}" target="_blank">${video.url}</a><br>
                Duration: ${video.duration}<br>
                Views: ${video.views}<br>
                Uploaded: ${video.uploaded}<br>
                Channel: <a href="${video.channel.url}" target="_blank">${video.channel.name}</a>
              </div>
              <hr>
            `,
          )
          .join("")
        break
      case "ytdl":
        resultTitle.textContent = "YouTube Download Link:"
        resultContent.innerHTML = `
          <strong>${data.title}</strong><br>
          <a href="${data.downloadUrl}" target="_blank">Download Video</a><br>
          Format: ${data.format}<br>
          Quality: ${data.quality}
        `
        break
      case "lyrics":
        resultTitle.textContent = "Song Lyrics:"
        resultContent.innerHTML = `<pre>${data.lyrics || "Lyrics not found."}</pre>`
        break
      case "tiktok":
        resultTitle.textContent = "TikTok Video Information:"
        resultContent.innerHTML = `
          <strong>${data.title}</strong><br>
          Author: ${data.author}<br>
          <a href="${data.downloadUrl}" target="_blank">Download Video</a><br>
          <img src="${data.cover}" alt="Video Thumbnail" style="max-width: 200px;"><br>
          Music: ${data.musicTitle} by ${data.musicAuthor}
        `
        break
      default:
        resultTitle.textContent = "Result:"
        resultContent.textContent = "No valid data returned."
    }
  } catch (error) {
    resultContainer.style.display = "block"
    resultTitle.textContent = "Error:"
    resultContent.textContent = `An error occurred: ${error.message}`
  }
}

fetchDataButton.addEventListener("click", fetchData)

