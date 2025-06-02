package main

import (
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"time"
)

// Player settings
const (
	PLAYER_FONT                 = "Verdana"
	PLAYER_BG_COLOR             = "000000"
	PLAYER_FONT_COLOR           = "ffffff"
	PLAYER_PRIMARY_COLOR        = "00edc3"
	PLAYER_SECONDARY_COLOR      = "10fdd3"
	PLAYER_LOADER               = "1"
	PREFERRED_SERVER            = "0"
	PLAYER_SOURCES_TOGGLE_TYPE  = "1"
)

func playerHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	videoID := query.Get("video_id")
	if videoID == "" {
		http.Error(w, "Missing video_id", http.StatusBadRequest)
		return
	}

	isTMDB := query.Get("tmdb")
	if isTMDB == "" {
		isTMDB = "0"
	}
	season := query.Get("season")
	if season == "" {
		season = query.Get("s")
		if season == "" {
			season = "0"
		}
	}
	episode := query.Get("episode")
	if episode == "" {
		episode = query.Get("e")
		if episode == "" {
			episode = "0"
		}
	}

	params := url.Values{}
	params.Set("video_id", videoID)
	params.Set("tmdb", isTMDB)
	params.Set("season", season)
	params.Set("episode", episode)
	params.Set("player_font", PLAYER_FONT)
	params.Set("player_bg_color", PLAYER_BG_COLOR)
	params.Set("player_font_color", PLAYER_FONT_COLOR)
	params.Set("player_primary_color", PLAYER_PRIMARY_COLOR)
	params.Set("player_secondary_color", PLAYER_SECONDARY_COLOR)
	params.Set("player_loader", PLAYER_LOADER)
	params.Set("preferred_server", PREFERRED_SERVER)
	params.Set("player_sources_toggle_type", PLAYER_SOURCES_TOGGLE_TYPE)

	requestURL := "https://getsuperembed.link/?" + params.Encode()

	client := &http.Client{
		Timeout: 7 * time.Second,
	}

	resp, err := client.Get(requestURL)
	if err != nil {
		http.Error(w, "Request server didn't respond", http.StatusServiceUnavailable)
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	playerURL := string(body)

	if len(playerURL) > 8 && playerURL[:8] == "https://" {
		http.Redirect(w, r, playerURL, http.StatusFound)
		return
	}

	tmpl := `<span style="color:red">{{.}}</span>`
	t := template.Must(template.New("error").Parse(tmpl))
	t.Execute(w, playerURL)
}

func main() {
	http.HandleFunc("/", playerHandler)
	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
