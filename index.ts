import { Client, StageChannel, User } from 'discord.js';
import { readFileSync, appendFileSync, writeFileSync } from 'fs';
import { RateLimiter } from 'limiter';

const SUSHI_GUILD_ID = "748031363935895552"
const AMA_CHANNEL_ID = "827196357290229801"

const client = new Client({ intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS', 'GUILD_MEMBERS']});

const token = readFileSync("token.txt", {encoding: "utf-8"});
const message = readFileSync("message.txt", {encoding: "utf-8"});
const poaps = readFileSync("poaps.txt", {encoding: "utf-8"}).split("\n");

const delay = 10; // in seconds
const requiredLogs = 2;

let poapsSent = 0;

const limiter = new RateLimiter({ tokensPerInterval: 100, interval: 60000 });

main()

async function main() {
    await logIn();
    writeFileSync("failed.txt", "");

    const users: {[user: string]: number} = {};

    while(true) {
        (await collectUsers()).forEach(user => {
            users[user.id] = users[user.id] ? users[user.id] + 1 : 1;
            if(users[user.id] === requiredLogs) sendMessage(user);
        })

        await sleep(delay * 1000);
    }
}

async function logIn() {
    try { await client.login(token); }
    catch(err) {console.log(err)}
}

async function collectUsers() {
    const stage = await client.channels.fetch(AMA_CHANNEL_ID, false) as StageChannel;

    return stage.members.map(a => a.user);
}

async function sendMessage(user: User) {
    const poapsSentLocal = poapsSent;
    poapsSent++

    await limiter.removeTokens(1);

    try {
        await user.send(poaps[poapsSentLocal] + "\n\n" + message);
    }
    catch(err) {
        console.log("Failed to send message to: " + user.username);
        appendFileSync("failed.txt", user.id + "\n");
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}