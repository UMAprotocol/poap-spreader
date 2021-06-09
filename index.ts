import { Client, StageChannel, User } from 'discord.js';
import { readFileSync } from 'fs';

const AMA_CHANNEL_ID = "827196357290229801"

const client = new Client({ intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS', 'GUILD_MEMBERS']});

const token = readFileSync("token.txt", {encoding: "utf-8"});
const message = readFileSync("message.txt", {encoding: "utf-8"});
const poaps = readFileSync("poaps.txt", {encoding: "utf-8"}).split("\n");

main()

async function main() {
    await logIn();

    const users = await collectUsers();

    await sendMessages(users);
    process.exit();
}

async function logIn() {
    try { await client.login(token); }
    catch(err) {console.log(err)}
}

async function collectUsers() {
    const stage = await client.channels.fetch(AMA_CHANNEL_ID, false) as StageChannel;

    return stage.members.map(a => a.user);
}

async function sendMessages(users: User[]) {
    for(var i = 0; i < users.length; i++) {
        await users[i].send(poaps[i] + "\n\n" + message);
    }

    console.log(`${i} POAPs were sent.`)
}
