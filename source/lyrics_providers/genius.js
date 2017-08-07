function fetchLyrics(DOMArtist, DOMTrack){
    var url = "https://api.genius.com/search?access_token=" + GENIUS_ACCESS_TOKEN + "&q=" + DOMArtist + "%20" + DOMTrack + "&per_page=1";
    jQuery.getJSON(url, function (data) {
        console.log(data);

        // Gorillaz Kids With Guns (feat. Neneh Cherry) is display album tracklist instead of lyrics
		if(data.response.hits.length > 0 && data.response.hits[0].result.title == DOMTrack){
			loadLyricsPage(DOMArtist, DOMTrack, "https://genius.com" + data.response.hits[0].result.path);
		}else{
			onLyricsLoadError(DOMArtist, DOMTrack, "Could not find song with Genuis");
		}
    }).fail(function (err) {
        // Something went wrong with the request. Alert the user
        onLyricsLoadError(DOMArtist, DOMTrack, "There was an error trying to reach the API");
        console.log(err);
    });
}

function loadLyricsPage(DOMArtist, DOMTrack, url){
    $.get( url, function( data ) {
        var html = $($.parseHTML(data));
        var artist = html.find(".header_with_cover_art-primary_info-primary_artist").text();
        var track = html.find(".header_with_cover_art-primary_info-title ").text();
		var lyrics = html.find(".lyrics").text().replace(/(\[.+\])/g, '');
        var response = {
            "artist": artist.trim(),
            "track": track.trim(),
            "static": lyrics.trim()
        };

        onLyricsLoadFinished(response, DOMArtist, DOMTrack);

    }).fail(function(err){
        // Something went wrong with the request. Alert the user
        onLyricsLoadError(DOMArtist, DOMTrack, "There was an error trying to reach the API");
    });
}
