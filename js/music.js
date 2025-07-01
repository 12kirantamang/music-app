    const API_KEY = '';

    async function searchMusic() {
      const query = document.getElementById("searchInput").value;
      if (!query) return;

      try {
      const response = await fetch(
  `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=1&q=${encodeURIComponent(query + ' lyrics')}&key=${API_KEY}`
);

        const data = await response.json();
        console.log("YouTube API:", data);

        if (data.items && data.items.length > 0 && data.items[0].id.videoId) {
          const videoId = data.items[0].id.videoId;
          const videoTitle = data.items[0].snippet.title;

          document.getElementById("youtubePlayer").src = `https://www.youtube.com/embed/${videoId}`;

          // Parse title to get artist and song
          const parts = query.split("-");
          const artist = parts[0]?.trim() || "Unknown Artist";
          const song = parts[1]?.trim() || videoTitle;

          document.getElementById("songTitle").textContent = song;
          document.getElementById("artistName").textContent = artist;

          // Get lyrics
          const lyricsRes = await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
          const lyricsData = await lyricsRes.json();
          document.getElementById("lyricsBox").textContent =
            lyricsData.lyrics || "Lyrics not found.";
        } else {
          alert("No embeddable video found.");
        }
      } catch (error) {
        console.error("Error fetching:", error);
        document.getElementById("lyricsBox").textContent = "Lyrics not available.";
      }
    }