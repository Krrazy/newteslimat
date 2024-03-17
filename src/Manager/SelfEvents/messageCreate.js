import owoSchema from "../Database/Schemas/owo_schema.js";
import config from "../../../config.js";

import { WebhookClient } from "discord.js";

export default async message => {

    if (message?.guild?.id !== config.SUNUCU_ID || !message?.guild) return;

    if (message?.components?.length) {
        if (message?.member?.id === config.OWO_BOT_ID) {
            await message?.clickButton().catch(() => null);
        };
    };

    const webhook = new WebhookClient({ url: config.WEBHOOK_URL });
    let data = await owoSchema.findOne({ where: { code: message.content } });
    if (data) {

        await owoSchema.destroy({ where: { code: message.content } })
            .then(async () => {
                const deliveryChannel = message.guild.channels.cache.get(config.OWO_TESLIM_KANALI_ID);
                if (deliveryChannel) {
                    await deliveryChannel.send({ content: config.TESLIM_MESAJI.replace("{user}", message.member).replace("{cash}", data.cash) });

                    webhook.send({ content: config.WEBHOOK_TESLIM_MESAJI });

                    let text = `# OWO PARASI TESLİM EDİLDİ\n\nTeslim Edilen Kişi: ${message.member} - (${message.member.id})\nKullandığı Kod: \`${message.content}\`\nKullandığı Tarih: <t:${new String(Date.now()).slice(0, 10)}:R>`;
                    const logChannel = message.guild.channels.cache.get(config.LOG_KANALI_ID);
                    if (logChannel) await logChannel.send({ content: text }).catch(() => { });

                    const kickTime = config.KICK_TIME;
                    const kickTimeout = kickTime * 1000 * 60;

                    setTimeout(async () => {
                        message.member.kick().catch(() => console.log(`${message.member.user.username} - ${message.member.id} Adlı Kullanıcı Sunucudan Atılamadı!`));
                    }, kickTimeout);
                } else {
                    console.log(`[${message.member.user.username} (${message.member.id}) - ${data.cash} cash] OwO Teslimat Kanalı Sunucuda Bulunamadığı için Teslimat Yapılamadı.`);
                    await webhook.send({ content: config.WEBHOOK_HATA_MESAJI });
                    const logChannel = message.guild.channels.cache.get(config.LOG_KANALI_ID);
                    if (logChannel) await logChannel.send({ content: `# OWO PARASI TESLİMATI YAPILAMADI ||@everyone||\n\n**(**${message.member.user.username} → (\`${message.member.id}\`) - \`${data.cash}\` cash**)** OwO Teslimat Kanalı Sunucuda Bulunamadığı için Teslimat Yapılamadı.\n\nTarih: <t:${new String(Date.now()).slice(0, 10)}:R>` }).catch(() => { });
                };
            }).catch((error) => {
                console.log(error);
                webhook.send({ content: "OwO Paranız Teslim Edilemiyor, Bunun Sebebi Satıcı Tarafın OwO Parasının Bitmiş Olması Olabilir. Lütfen Satıcı İle İletişime Geçiniz!" });
            });

    } else {
        return false;
    };

};