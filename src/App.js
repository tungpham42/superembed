import { useEffect } from "react";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const video_id = params.get("video_id");

    if (!video_id) {
      document.body.innerHTML = "Missing video_id";
      return;
    }

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
