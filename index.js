const fetch = require("node-fetch")
const readline = require("readline");
const fs = require("fs")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('❗ Please Enter Text: ', async (text) => {
  try {
  const jsi = await fetch(`https://api.tiklydown.eu.org/api/download?url=${text}`)
  const res = await jsi.json()
  console.log(`\n\n\n  TIKLYDOWN-DL
  Desk: ${res.title}
  Diputar: ${res.stats.playCount}
  Disukai: ${res.stats.likeCount}
  ID: ${res.id}
  Dibuat: ${res.created_at}
  Creator: ${res.author.name} (${res.unique_id}) 
  Musik: ${res.music.title}
  
  Github: rizxyu
  `)
  
  const time = new Date().getTime();
      const filename = "media/"+time + '.mp4';
      const filenm = time + '.mp4';
      
      
  if (!res.video) {
    for (let i = 0; i < res.images.length; i++) {
        const imageUrl = res.images[i].url;
        const filenamejpg =  time + '_image' + i + '.jpg';
        const rsp = await fetch(imageUrl);
        const buffer = await rsp.buffer();
        fs.writeFileSync(filenamejpg, buffer);
        console.log("Saved!")
  }
  }
  if (res.video){
  const videoStream = fs.createWriteStream(filename);
      const videoUrl = res.video.noWatermark;
      const response = await fetch(videoUrl);
      response.body.pipe(videoStream);

      videoStream.on('finish', () => {
        console.log('Successful Saving ', filenm + ' in file');
        rl.close();
      });
  }
  } catch (err) {
    console.log(err)
    rl.close();
  }
})
