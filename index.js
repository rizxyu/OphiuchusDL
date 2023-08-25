const fs = require("fs");
const readline = require("readline");
const fetch = require("node-fetch");
const { v1 } = require("tiklydown-sanzy");
const consola = require("consola");
const ytdl = require("ytdl-core");
const { Spotify } = require("spotifydl-core");
const { author, version } = require("./package.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const spotify = new Spotify({
  clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3',
  clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009'
});

const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)?youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)?|youtu\.be\/)([-_0-9A-Za-z]{11})/

consola.start("DOWNLOADER (BETA)");
consola.info("Support Link Youtube, Tiktok, Spotify track | Github: " + author + " | Version:", version);
consola.warn("Please paste the link below, if you want to exit, type 'q'.");

rl.question('❗ Please Enter Text: ', async (text) => {
  if (/https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com/i.test(text)) {
    try {
      const time = new Date().getTime();
      const filename = '/sdcard/Download/' + time + '.mp4';
      const filenm = time + '.mp4';
      const data = await v1(text);
      consola.warn('🎥 Video:', data.url);
      consola.warn('🏷️ Deskripsi: ', data.title);
      const videoStream = fs.createWriteStream(filename);
      const videoUrl = data.video.noWatermark;
      const response = await fetch(videoUrl);
      response.body.pipe(videoStream);

      videoStream.on('finish', () => {
        consola.success('Successful Saving ', filenm + ' in file');
        rl.close();
      });
    } catch (error) {
      console.error('Error:', error);
      rl.close();
    }
  } else if (/^Q$/i.test(text)) {
    consola.start("Exit...");
    rl.close();
  } else if (ytIdRegex.test(text)) {
    try {
      const info = await ytdl.getInfo(text);
      const title = info.videoDetails.title;
      const artist = info.videoDetails.author.name;
      console.log('🏷️ Title: ', title + "\n" + "🎙️ Channels: " + artist);
      const audioFilename = "/sdcard/Download/" + title + ".mp3";
      const fileneme = title + ".mp3";
      consola.start("Process of downloading audio");
      await ytdl(text, { filter: 'audioonly' })
        .pipe(fs.createWriteStream(audioFilename))
        .on('finish', async () => {
          consola.success('🚨 Audio is saved as ', fileneme);
        });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      rl.close();
    }
  } else if (/https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)/i.test(text)) {
    let kp = await spotify.getTrack(text);
    let kp2 = await spotify.downloadTrack(text);
    var res = {
      creator: "Follow IG: rizxyux",
      judul: kp.name,
      artis: kp.artists,
      album: kp.album_name,
      rilis: kp.release_date,
      thumb: kp.cover_url,
      audio: kp2
    };
    const { judul, album, artis, rilis, thumb, audio } = res;
    console.log(`SPOTIFY DOWNLOADER\n\nTitle: ${judul}\nAlbum: ${album}\nArtist: ${artis}\nRealese Date: ${rilis}`);
    fs.writeFileSync("/sdcard/Download/" + judul + '.mp3', audio);
    consola.success('Audio is saved');
    rl.close();
  }
});
