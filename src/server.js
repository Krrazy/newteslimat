import config from "../config.js";
import loader from "./Manager/loader.js";
import selfLoader from "./Manager/selfLoader.js";
import dataSchema from "./Manager/Database/Schemas/data_schema.js";

import SelfToken from "discord.js-selfbot-v13";
import { Client } from "discord.js";

import fs from 'fs';

function dosyaOku() {
  fs.readFile('owo.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
    geriSayim();
  });
}

function geriSayim() {
  var zencigot_kayyu = 3;
  console.log("Dosya okuma işlemi tamamlandı!");
  console.log("Botun Başlamasına Son: " + zencigot_kayyu + " saniye");
  
  var interval = setInterval(function() {
    zencigot_kayyu--;
    console.log("Botun Başlamasına Son: " + zencigot_kayyu + " saniye");
    if (zencigot_kayyu < 0) {
      clearInterval(interval);
      sonrakiKoduCalistir();
    }
  }, 1000);
}

function sonrakiKoduCalistir() {
  console.log("OwO Teslimat Botunuz Aktifleştirildi!");
  // burada ekstra komutlarınızı çalıştırabilirsiniz
}

dosyaOku();

const selfClient = new SelfToken.Client({
    checkUpdate: false,
});

const client = new Client({
    intents: [3276799]
});

selfClient.on("ready", client => {
    selfLoader(client);
});

client.on("ready", async client => {

    loader(client);

    await dataSchema.findOne({ where: { id: 1 } })
        .then((result) => {
            if (result && result.account) {
                selfClient.login(result.account)
                    .then(() => console.log(`${selfClient.user.username} ismiyle teslim hesabı bağlantısı kuruldu.`))
                    .catch(() => { });
            }
        });
});

client.login(config.BOT_TOKEN)
    .then(() => console.log(`${client.user.username} ismiyle Discord BOT bağlantısı kuruldu.`))
    .catch(() => console.log("BOT bağlantısı kurulamadı. Discord BOT tokeninizi kontrol edin!"))

// burada sayacı durdurmak için bir kod ekleyebilirsiniz
