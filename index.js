const discord = require('discord.js');
const fetch = require('get-json');
const mongoose = require("mongoose");
const axios = require('axios');
const express = require('express');
const { URL } = require("url");
const app = express();
const b = new discord.Client();

const loot = require('./data/items');
const eeee = require('./data/enemies');

const match = require('./db/match')
const users = require('./db/users')
const enemies = require('./db/enemys')

const ver = 'PRE-1.2.5'
const prefix = "."

mongoose.connect("mongodb+srv://bot:q91e8w1skIPPnQJE@cluster0.axpdp.mongodb.net/e?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/fight', async function(req, res){
    let url = new URL("http://url.api.wiresdev.ga/"+req.url)
    let id = url.searchParams.get("id")
    
    let e = await enemies.findById(id)

    res.render(__dirname + '/views/fight.ejs', {
        e: e,
    })
})

b.on('ready', async function(){
    console.log('online')

    b.channels.cache.get('805830098175131718').messages.fetch().then(messages => { // Fetches the messages
        b.channels.cache.get('805830098175131718').bulkDelete(messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
    )});

    fetch('http://3.10.143.23/api/nowplaying/3').then(res => {
        let aT = ['<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>']

        let time = Math.round((res.now_playing.elapsed / res.now_playing.duration) * 20)

        aT[time] = '<:cirlle:805829216770850866>'

        fetch('https://api.deezer.com/search?q='+res.now_playing.song.text).then(res2 => {
            const embed = new discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Vibe In Anime')
                .setDescription('**Now Playing**\n\nNow Playing: '+res.now_playing.song.text+'\n\n'+aT.join('')+'\n\nYou can use commands like .skip to skip a song!')
                .setThumbnail(res2.data[0].album.cover_xl)
                .setFooter('© ItzWiresDev#6193 2020', '');

            b.user.setActivity(res.now_playing.song.text+' Version: '+ver);

            b.channels.cache.get('805830098175131718').send(embed).then(sentMsg => {
                setInterval(function() {
                    fetch('http://3.10.143.23/api/nowplaying/3').then(res => {
                        let aT = ['<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>', '<:dash:805829216695353374>','<:dash:805829216695353374>']
                        let time = Math.round((res.now_playing.elapsed / res.now_playing.duration) * 20)

                        let dj

                        if(!res.live.is_live){
                            dj = 'Auto DJ'
                        } else{
                            dj = res.live.streamer_name
                        }

                        aT[time] = '<:cirlle:805829216770850866>'

                        fetch('https://api.deezer.com/search?q='+res.now_playing.song.text).then(res2 => {
                            const embed = new discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('Vibe In Anime')
                                .setDescription('**Now Playing**\n\nNow Playing: '+res.now_playing.song.text+'\n\nDJ: '+dj+'\n\n'+aT.join(''))
                                .setThumbnail(res2.data[0].album.cover_xl)
                                .setFooter('© ItzWiresDev#6193 2020', '');

                            b.user.setActivity(res.now_playing.song.text+' Version: '+ver);

                            sentMsg.edit(embed)
                        })
                    })
                }, 10000);
            })
        })
    })
})

b.on('message', async function(msg){
    let userData = await users.findById(msg.author.id);
    if (!userData)userData = await users.create({
        _id: msg.author.id,
        loot: [
            {
                "name": "Travellers Sword",
                "iconUrl": "http://wiresboy.ga/emoji/Travellers%20Sword.png",
                "icon": "<:TravellersSword:806186592095830056>",
                "buyPrice" : 2500,
                "type": "weapon",
                "amount": 1,
                "stats": {
                    "attack": 50,
                    "level": 1,
                    "stars": 4
                }
            },
        ],
        username: msg.author.tag,
        currency: 0,
        dead: false,
        weapon: {
            "name": "Travellers Sword",
            "iconUrl": "http://wiresboy.ga/emoji/Travellers%20Sword.png",
            "icon": "<:TravellersSword:806186592095830056>",
            "buyPrice" : 2500,
            "type": "weapon",
            "amount": 1,
            "stats": {
                "attack": 50,
                "level": 1,
                "stars": 4
            }
        },
    });

    if (msg.guild == null) return;
    if (msg.author.bot) return;

    if(userData.dead === true){
        msg.delete()

        var msg1 = new discord.MessageEmbed()
            .setColor("#00ffff")
            .setTitle('You are dead')
            .setDescription('To respawn click [here!](https://wiresdev.ga)')
            .setFooter(msg.author.username, msg.author.displayAvatarURL())
            .setTimestamp();

        msg.author.send(msg1)

        return;
    }

    if (Math.floor(Math.random() * 50) === 1){
        setTimeout(function(){
            spawnLoot(msg)
        }, Math.floor((Math.random() * 1000) + 0))
    }

    if (Math.floor(Math.random() * 40) === 1){
        setTimeout(async function(){
            let enemy2 = eeee[Math.floor((Math.random() * eeee.length) + 0)]

            let newEnemy = await enemies.create({
                _id: await enemies.countDocuments(),
                hp: enemy2.hp,
                name: enemy2.name,
                img: enemy2.img,
            })

            var msg1 = new discord.MessageEmbed()
                .setColor("#00ffff")
                .setTitle('Enemy')
                .setDescription('Oh no an '+newEnemy.name+' appeared\n\nfight it [here!](https://hoLeeFuk.wiresdev.ga/fight?id='+newEnemy._id+')')
                .setImage(newEnemy.img)
                .setFooter(msg.author.username, msg.author.displayAvatarURL())
                .setTimestamp();

            msg.channel.send(msg1)
        }, Math.floor((Math.random() * 1000) + 0))
    }

    let aTA = Math.floor((Math.random() * 5) + 1);
    userData.currency = userData.currency + aTA
    userData.save()

    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    if(command === "inv" || command === "inventory"){
        var msg1 = new discord.MessageEmbed()
            .setColor("#00ffff")
            .setTitle('Check your DMs')
            .setDescription('I DMed you your inventory\nor you can view it [here!](https://wiresdev.ga)')
            .setFooter(msg.author.username, msg.author.displayAvatarURL())
            .setTimestamp();

        msg.channel.send(msg1)

        let renderText = "";
        let i = 1

        userData.loot.forEach(loot => {
            renderText = `${renderText}**${i}) ${loot.icon} ${loot.name}**\n`;
            i++
        })

        let renderBox = new discord.MessageEmbed() //set the embed
            .setColor("#00ffff")
            .setTitle("Inventory")
            .setDescription(renderText + "\n\n🪙 " + userData.currency)
            .setFooter(msg.author.username, msg.author.displayAvatarURL())
            .setTimestamp();

        return msg.author.send(renderBox);
    }

    if(command === "vc"){
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.channel.send("No voice channel.");

        voiceChannel.join()
            .then(connection => {
                connection.play('https://never-gonna-give-you-up-never-gonna-let-you-down.wiresdev.ga/radio/8020/radio.mp3?1612259607', {volume: 0.5});
            });
    }

    if(command === "say"){
        msg.delete()
        msg.channel.send(msg.content.split('.say ').join(''))
    }

    if(command === "lb" || command === "leaderboard"){
        var database = await users.find({})

        database.sort((a, b) => b.currency - a.currency)

        let renderText = ''
        let i = 1

        database.forEach(u => {
            renderText = renderText + i + ') ' + u.username + '🪙' + u.currency + '\n'
            i++
        })

        let embed = new discord.MessageEmbed() //set the embed
            .setColor("#00ffff")
            .setTitle("Leader Board")
            .setDescription(renderText)
            .setFooter(msg.author.username, msg.author.displayAvatarURL())
            .setTimestamp();

        msg.channel.send(embed)
    }

    if(command === "fact"){
        if(args[0] === "dog"){
            fetch('https://some-random-api.ml/facts/dog').then(data => {
                msg.channel.send(data.fact)
            })
        } else if(args[0] === "cat"){
            fetch('https://some-random-api.ml/facts/cat').then(data => {
                msg.channel.send(data.fact)
            })
        } else if(args[0] === "panda"){
            fetch('https://some-random-api.ml/facts/panda').then(data => {
                msg.channel.send(data.fact)
            })
        } else if(args[0] === "fox"){
            fetch('https://some-random-api.ml/facts/fox').then(data => {
                msg.channel.send(data.fact)
            })
        } else if(args[0] === "bird"){
            fetch('https://some-random-api.ml/facts/bird').then(data => {
                msg.channel.send(data.fact)
            })
        } else if(args[0] === "koala"){
            fetch('https://some-random-api.ml/facts/koala').then(data => {
                msg.channel.send(data.fact)
            })
        } else{
            fetch('https://uselessfacts.jsph.pl/random.json?language=en').then(data => {
                msg.channel.send(data.text)
                msg.channel.send('For an animal fact please use `dog`, `cat`, `panda`, `redpanda`, `fox`, `bird`, `koala`')
            })
        }
    }

    if(command === "image"){
        if(args[0] === "dog"){
            fetch('https://some-random-api.ml/img/dog').then(data => {
                msg.channel.send(data.link)
            })
        } else if(args[0] === "cat"){
            fetch('https://some-random-api.ml/img/cat').then(data => {
                msg.channel.send(data.link)
            })
        } else if(args[0] === "panda"){
            fetch('https://some-random-api.ml/img/panda').then(data => {
                msg.channel.send(data.link)
            })
        } else if(args[0] === "redpanda"){
            fetch('https://some-random-api.ml/img/red_panda').then(data => {
                msg.channel.send(data.link)
            })
        } else if(args[0] === "bird"){
            fetch('https://some-random-api.ml/img/birb').then(data => {
                msg.channel.send(data.link)
            })
        } else if(args[0] === "fox"){
            fetch('https://some-random-api.ml/img/fox').then(data => {
                msg.channel.send(data.link)
            })
        } else if(args[0] === "koala"){
            fetch('https://some-random-api.ml/img/koala').then(data => {
                msg.channel.send(data.link)
            })
        } else{
            msg.channel.send('Please use `dog`, `cat`, `panda`, `redpanda`, `fox`, `bird`, `koala`')
        }
    }

    if(command === "wink"){
        fetch('https://some-random-api.ml/animu/wink').then(data => {
            msg.channel.send(data.link)
        })
    }

    if(command === "hug"){
        fetch('https://some-random-api.ml/animu/hug').then(data => {
            msg.channel.send(data.link)
        })
    }

    if(command === "pat"){
        fetch('https://some-random-api.ml/animu/pat').then(data => {
            msg.channel.send(data.link)
        })
    }

    if(command === "skip"){
        let config = {
            headers: {
                'X-API-Key': 'f62651231eb83206:925d45490dd564c544fa11c6e14ca252',
            }
        }

        axios.post('http://3.10.143.23/api/station/3/backend/skip', {}, config)
            .then(res => {
                msg.channel.send(res.data.formatted_message)
            })
            .catch(error => {
                console.error(error)
            })
    }

    if(command === "dev"){
        if(msg.author.id != "595628769138442250")return msg.channel.send('no')

        if(args[0] === "drop"){
            spawnLoot(msg)
        }

        if(args[0] === "enemy"){
            let enemy2 = eeee[Math.floor((Math.random() * eeee.length) + 0)]

            let newEnemy = await enemies.create({
                _id: await enemies.countDocuments(),
                hp: enemy2.hp,
                name: enemy2.name,
                img: enemy2.img,
            })

            var msg1 = new discord.MessageEmbed()
                .setColor("#00ffff")
                .setTitle('Enemy')
                .setDescription('Oh no an '+newEnemy.name+' appeared\n\nfight it [here!](https://hoLeeFuk.wiresdev.ga/fight?id='+newEnemy._id+')')
                .setImage(newEnemy.img)
                .setFooter(msg.author.username, msg.author.displayAvatarURL())
                .setTimestamp();

            msg.channel.send(msg1)
        }
    }

    if(command === "calc"){
        if(args[0] === "depression"){
            msg.channel.send(msg.author.tag+'\'s depression '+Math.floor((Math.random() * 1000000) + 100000))
        } else if(args[1] === "-"){
            msg.channel.send(parseFloat(args[0]) - parseFloat(args[2]))
        } else if(args[1] === "+"){
            msg.channel.send(parseFloat(args[0]) + parseFloat(args[2]))
        } else if(args[1] === "/"){
            msg.channel.send(parseFloat(args[0]) / parseFloat(args[2]))
        } else if(args[1] === "*"){
            msg.channel.send(parseFloat(args[0]) * parseFloat(args[2]))
        }
    }

    if(command === "poke"){
        if(msg.author.id === "669103642728464384")return msg.channel.send('no u');
    }

    if(command === "match"){
        try{
            if(msg.mentions.toJSON().users.length != 2){
                msg.channel.send('please mention 2 users')
                return
            }

            if(msg.author.id === "669103642728464384")return msg.channel.send('no');

            if(!b.users.cache.get(msg.mentions.toJSON().users[0]).tag)return msg.channel.send('please mention 2 users');
            if(!b.users.cache.get(msg.mentions.toJSON().users[1]).tag)return msg.channel.send('please mention 2 users');

            let match1 = await match.findOne({ u1: b.users.cache.get(msg.mentions.toJSON().users[0]).id, u2: b.users.cache.get(msg.mentions.toJSON().users[0]).id })
            if(!match1)match1 = await match.create({
                _id: await match.countDocuments(),
                u1: b.users.cache.get(msg.mentions.toJSON().users[0]).id,
                u2: b.users.cache.get(msg.mentions.toJSON().users[0]).id,
                score: Math.floor((Math.random() * 100) + 0),
            })

            let bar = ['', '', '', '', '', '', '', '', '', '']

            let i = 0
            while(i < (match1.score / 10)){
                bar[i] = '█'
                i++
            }

            let conclution = ''

            if(match1.score < 15){
                conclution = ':broken_heart: This ship sank before it set sail...'
            } else if(match1.score < 30){
                conclution = ':broken_heart: This ship will sink for sure...'
            } else if(match1.score < 50){
                conclution = ':heartpulse: A little rocky but it can work out!'
            } else if(match1.score < 75){
                conclution = ':heart:️ A good match!'
            } else if(match1.score < 100){
                conclution = ':blue_heart: So cute together!'
            }

            const embed = new discord.MessageEmbed()
                .setColor('#FE81D2')
                .setTitle('❯ Matchmaking ❮')
                .setThumbnail('https://cdn.discordapp.com/avatars/805805267110461464/48465b098288ab680fd1aa15592a3564.webp?size=1024')
                .setDescription('Here\'s what I think about this ship...')
                .addFields(
                    { name: 'Person 1', value: b.users.cache.get(msg.mentions.toJSON().users[0]).tag, inline: true },
                    { name: 'Person 2', value: b.users.cache.get(msg.mentions.toJSON().users[1]).tag, inline: true },
                    { name: 'Love Score', value: match1.score+'/100', inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Love Bar', value: bar.join(''), inline: true },
                    { name: 'Conclusion', value: conclution, inline: true },
                )
                .setTimestamp()
                .setFooter('ItzWiresDev#6193 2021', '');

            msg.channel.send(embed)
        } catch(e){
            msg.channel.send(e)
        }
    }
});

b.login('ODA1ODA1MjY3MTEwNDYxNDY0.YBgOog.yFIkYLpwr3sZ-sTMYC-0z6pHAqg');

//functions

async function spawnLoot(msg) {
    //for loot item spawns
    var lootNr = Math.floor(Math.random() * loot.length) + 0; //get a random item
    var lootName = loot[lootNr].name;
    let lootItem = loot[lootNr];
  
    currentLoot = lootItem;
  
    var lootSpawn = new discord.MessageEmbed() //create the embed
        .setColor("#00ffff")
        .setTitle(lootName + " " + lootItem.icon)
        .setDescription('First to react collects the item')
        //.setImage(imgURL)
        .setTimestamp();
  
    msg.channel.send(lootSpawn).then(async function(sentMessage) {
      //send the message
      sentMessage.react("🪙"); //add reaction
  
      const filter = (reaction, user) => {
        return ["🪙"].includes(reaction.emoji.name) && user.id != b.user.id;
      };
  
      sentMessage //messagecollector
        .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
        .then(async collected => {
          const reaction = collected.first();
  
          if (reaction.emoji.name === "🪙") {
            //if the user reacted with the coin emoji
            lootSpawn = new discord.MessageEmbed() //update the embed
              .setColor("#00ffff")
              .setTitle(lootName + " " + lootItem.icon)
              .setDescription(
                "collected by: **" + reaction.users.cache.last().username + "**"
              )
              //.setImage(imgURL)
              .setTimestamp();
  
            sentMessage.edit(lootSpawn);
  
            let userData = await users.findById(reaction.users.cache.last().id);
            if (!userData)userData = await users.create({
                _id: reaction.users.cache.last().id,
                loot: [],
                username: msg.author.tag,
                currency: 0,
                dead: false,
            });

            userData.loot.push(loot[lootNr])
            userData.save()
          }
        })
        .catch(collected => {}); //if the time runs out
    });
}
  
app.listen(6000)
