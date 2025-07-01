const API_KEY = 'AIzaSyD2caERyo5Ap2WAwc2X6Um5KCVNgM6oRUc';

    async function searchMusic() {
      const query = document.getElementById("searchInput").value;
      if (!query) {
        alert("Please enter a song to search");
        return;
      }

      // Show loading state
      document.getElementById("songTitle").textContent = "Searching...";
      document.getElementById("artistName").textContent = "Please wait";
      document.getElementById("lyricsBox").innerHTML = "<p>Loading lyrics...</p>";
      document.getElementById("videoStatus").textContent = "Loading video...";

      try {
        // Search YouTube for music video
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=1&q=${encodeURIComponent(query + " official music video")}&key=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.items && data.items.length > 0 && data.items[0].id.videoId) {
          const videoId = data.items[0].id.videoId;
          const videoTitle = data.items[0].snippet.title;
          const thumbnail = data.items[0].snippet.thumbnails.high.url;
          
          // Set YouTube video with autoplay and muted
          document.getElementById("youtubePlayer").src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
          document.getElementById("videoStatus").textContent = "Now playing: " + videoTitle;
          
          // Update album art
          document.getElementById("albumArt").src = thumbnail;
          
          // Parse title to get artist and song
          const parts = query.split("-");
          const artist = parts[0]?.trim() || "Unknown Artist";
          const song = parts[1]?.trim() || videoTitle;
          
          // Update song info
          document.getElementById("songTitle").textContent = song;
          document.getElementById("artistName").textContent = artist;
          
          // Get lyrics
          try {
            const lyricsRes = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
            if (lyricsRes.ok) {
              const lyricsData = await lyricsRes.json();
              document.getElementById("lyricsBox").innerHTML = 
                lyricsData.lyrics 
                  ? `<pre>${lyricsData.lyrics.replace(/\n/g, '<br>')}</pre>` 
                  : "<p>Lyrics not found for this song.</p>";
            } else {
              document.getElementById("lyricsBox").innerHTML = "<p>Could not load lyrics. Try another song.</p>";
            }
          } catch (lyricsError) {
            console.error("Lyrics error:", lyricsError);
            document.getElementById("lyricsBox").innerHTML = "<p>Lyrics service unavailable. Try again later.</p>";
          }
        } else {
          throw new Error("No video found");
        }
      } catch (error) {
        console.error("Search error:", error);
        document.getElementById("songTitle").textContent = "Error";
        document.getElementById("artistName").textContent = "Please try another search";
        document.getElementById("lyricsBox").innerHTML = "<p>Could not find music. Please try a different search term.</p>";
        document.getElementById("videoStatus").textContent = "Video not available";
      }
    }
    
    // Add event listener for Enter key
    document.getElementById("searchInput").addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        searchMusic();
      }
    });