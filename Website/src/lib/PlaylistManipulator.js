const fs = require('fs/promises');

function fancyTimeFormat(duration) {
	var hrs = ~~(duration / 3600);
	var mins = ~~((duration % 3600) / 60);
	var secs = ~~duration % 60;

	var ret = "";

	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;
	return ret;
}

function transformDifficultyName(name) {
    if (name.toLowerCase() === 'expertplus') {
        return 'Expert+';
    } else if (name.toLowerCase() === 'expert') {
        return 'Expert';
    }
    return name;
}

async function fetchExtraInfo(hash) {
    const url = `https://api.beatsaver.com/maps/hash/${hash}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch ${url}: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}: ${error}`);
        return null;
    }
}

async function transformPlaylist(inputPlaylist) {
    const songs = await Promise.all(
        inputPlaylist.songs.map(async song => {
            const extraInfo = await fetchExtraInfo(song.hash);
            let bsr = "";
            let song_name = song.songName;
            let song_artist = "";
            let song_mapper = "";
            let date_uploaded = "";
            let song_length = "";
            let song_bpm = "";
            let song_coverUrl = "";
            let difficulties = song.difficulties.map(diff => ({
                name: transformDifficultyName(diff.name),
                characteristic: diff.characteristic
            }));

            if (extraInfo) {
                if (extraInfo.stats && extraInfo.stats.downloads != null) {
                    bsr = extraInfo.id.toString();
                }
                if (extraInfo.metadata) {
                    song_name = extraInfo.metadata.songName || song.songName;
                    song_artist = extraInfo.metadata.songAuthorName || "";
                    song_mapper = extraInfo.metadata.levelAuthorName || "";
                    song_length = fancyTimeFormat(extraInfo.metadata.duration) || "";
                    song_bpm = extraInfo.metadata.bpm || "";
                }
                const uploadDate = extraInfo.uploaded || extraInfo.createdAt;
                if (uploadDate) {
                    const date = new Date(uploadDate);
                    date_uploaded = date.toISOString().split('T')[0];
                }
                song_coverUrl = extraInfo.versions[0].coverURL;
            }

            return {
                hash: song.hash,
                bsr,
                song_name,
                song_artist,
                song_mapper,
                date_uploaded,
                song_length,
                song_bpm,
                song_coverUrl,
                difficulties
            };
        })
    );

    return {
        playlistTitle: inputPlaylist.playlistTitle,
        songs: songs
    };
}

export async function manipulatePlaylist(inputPlaylist) {
    try {
        const data = await fs.readFile(inputPlaylist, 'utf8'); // Just input .bplist
        const inputPlaylistJSON = JSON.parse(data);
        const transformedPlaylist = await transformPlaylist(inputPlaylistJSON);
        await fs.writeFile('output.json', JSON.stringify(transformedPlaylist, null, 2), 'utf8');
        console.log('Transformed playlist saved to output.json');
    } catch (error) {
        console.error('Error:', error);
    }
}