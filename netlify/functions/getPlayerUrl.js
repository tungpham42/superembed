exports.handler = async function (event) {
  const fetch = (await import("node-fetch")).default;

  const params = event.queryStringParameters || {};
  const video_id = params.video_id;
  const is_tmdb = params.tmdb || 1;
  const season = params.s || 0;
  const episode = params.e || 0;

  if (!video_id || video_id.trim() === "") {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/html" },
      body: "Missing video_id",
    };
  }

  const defaultSettings = {
    player_font: "Arial",
    player_bg_color: "000000",
    player_font_color: "ffffff",
    player_primary_color: "dd202c",
    player_secondary_color: "555555",
    player_loader: 1,
    preferred_server: 0,
    player_sources_toggle_type: 1,
  };

  const query = new URLSearchParams({
    video_id,
    tmdb: is_tmdb,
    season,
    episode,
    ...defaultSettings,
  });

  const remoteUrl = `https://getsuperembed.link/?${query.toString()}`;

  try {
    const response = await fetch(remoteUrl, {
      redirect: "follow",
      timeout: 7000, // Matches PHP's 7-second timeout
    });
    const content = await response.text();

    if (content && content.startsWith("https://")) {
      return {
        statusCode: 302,
        headers: {
          Location: content.trim(),
        },
      };
    } else if (content) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: `<span style='color:red'>${content}</span>`,
      };
    } else {
      return {
        statusCode: 500,
        headers: { "Content-Type": "text/html" },
        body: "Request server didn't respond",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/html" },
      body: "Request server didn't respond",
    };
  }
};
