import { useEffect } from "react";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const video_id = params.get("video_id");
    const tmdb = params.get("tmdb") || "1"; // Default to 0 if not provided
    const s = params.get("s");
    const e = params.get("e");

    if (!video_id) {
      document.body.innerHTML = "Missing video_id";
      return;
    }

    // Optional: add validation or logging
    console.log("Video ID:", video_id);
    console.log("TMDB:", tmdb);
    if (s) console.log("Season:", s);
    if (e) console.log("Episode:", e);

    fetch(`/.netlify/functions/getPlayerUrl?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.redirect) {
          window.location.href = data.redirect;
        } else {
          document.body.innerHTML = `<span style="color:red">${
            data.error || "Invalid response"
          }</span>`;
        }
      })
      .catch(() => {
        document.body.innerHTML = `<span style="color:red">Error contacting server</span>`;
      });
  }, []);

  return null;
}

export default App;
