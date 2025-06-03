// getPlayerUrl.js
exports.handler = async function (event) {
  const fetch = (await import("node-fetch")).default;

  const params = event.queryStringParameters || {};
  const video_id = params.video_id;
  const tmdb = params.tmdb || 0;
  const season = params.season || 0;
  const episode = params.episode || 0;

  if (!video_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing video_id" }),
    };
  }

  const defaultSettings = {
    player_font: "Arial",
    player_bg_color: "000000",
    player_font_color: "ffffff",
    player_primary_color: "00edc3",
    player_secondary_color: "10fdd3",
    player_loader: 1,
    preferred_server: 0,
    player_sources_toggle_type: 1,
  };

  const query = new URLSearchParams({
    video_id,
    tmdb,
    season,
    episode,
    s: season,
    e: episode,
    ...defaultSettings,
  });

  const remoteUrl = `https://getsuperembed.link/?${query.toString()}`;

  try {
    const response = await fetch(remoteUrl);
    const content = await response.text();

    if (content.startsWith("https://")) {
      return {
        statusCode: 302,
        headers: {
          Location: content,
        },
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: content }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Request server didn't respond" }),
    };
  }
};
