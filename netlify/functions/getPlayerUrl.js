// getPlayerUrl.js
exports.handler = async function (event) {
  const fetch = (await import("node-fetch")).default;

  const {
    video_id,
    tmdb = 0,
    season = 0,
    episode = 0,
  } = event.queryStringParameters;

  if (!video_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing video_id" }),
    };
  }

  const playerSettings = {
    player_font: "Verdana",
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
    ...playerSettings,
  });

  const requestUrl = `https://getsuperembed.link/?${query.toString()}`;

  try {
    const response = await fetch(requestUrl);
    const player_url = await response.text();

    if (player_url.startsWith("https://")) {
      return {
        statusCode: 200,
        body: JSON.stringify({ redirect: player_url }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: player_url }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Request server didn't respond" }),
    };
  }
};
