const discord = require('discord.js');
const fetch = require('get-json');
const mongoose = require("mongoose");
const axios = require('axios')
const b = new discord.Client();

const match = require('./db/match')

const prefix = "."

mongoose.connect("mongodb+srv://bot:q91e8w1skIPPnQJE@cluster0.axpdp.mongodb.net/e?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

b.on('ready', async function(){
    console.log('online')

    b.channels.cache.get('805830098175131718').messages.fetch().then(messages => { // Fetches the messages
        b.channels.cache.get('805830098175131718').bulkDelete(messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
    )});

    fetch('http://3.10.143.23/api/nowplaying/2').then(res => {
        let aT = ['<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>', '<:dash:793908719099707462>']

        let time = Math.round((res.now_playing.elapsed / res.now_playing.duration) * 20)

        aT[time] = '<:cirlle:805829216770850866>'

        fetch('https://api.deezer.com/search?q='+res.now_playing.song.text).then(res2 => {
            const embed = new discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Vibe In Anime')
                .setDescription('**Now Playing**\n\nNow Playing: '+res.now_playing.song.text+'\n\n'+aT.join('')+'\n\nYou can use commands like .skip and .stop to control the music')
                .setThumbnail(res2.data[0].album.cover_xl)
                .setFooter('© ItzWiresDev#6193 2020', '');
		
    	    b.user.setActivity(res.now_playing.song.text);

            b.channels.cache.get('805830098175131718').send(embed).then(sentMsg => {
                setInterval(function() {
                    fetch('http://3.10.143.23/api/nowplaying/2').then(res => {
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
                                .setDescription('**Now Playing**\n\nNow Playing: '+res.now_playing.song.text+'\n\nDJ: '+dj+'\n\n'+aT.join('')+'\n\nYou can use commands like .skip and .stop to control the music')
                                .setThumbnail(res2.data[0].album.cover_xl)
                                .setFooter('© ItzWiresDev#6193 2020', '');
				
			    b.user.setActivity(res.now_playing.song.text);

                            sentMsg.edit(embed)
                        })
                    })
                }, 10000);
            })
        })
    })
})

b.on('message', async function(msg){
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if(command === "vc"){
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.channel.send("No voice channel.");

        voiceChannel.join()
            .then(connection => {
                connection.play('https://never-gonna-give-you-up-never-gonna-let-you-down.wiresdev.ga/radio/8010/radio.mp3?1612190236', {volume: 0.5});
            });
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
	
    if(command === "stop"){
       const voiceChannel = msg.member.voice.channel;
       if (!voiceChannel) return msg.channel.send("No voice channel.");
	   
        voiceChannel.leave()
	msg.channel.send('I left!!!')
    }

    if(command === "skip"){
        let config = {
            headers: {
                'X-API-Key': 'f62651231eb83206:925d45490dd564c544fa11c6e14ca252',
            }
        }

        axios.post('http://3.10.143.23/api/station/2/backend/skip', {}, config)
            .then(res => {
                msg.channel.send(res.data.formatted_message)
            })
            .catch(error => {
                console.error(error)
            })
    }

    if(command === "match"){
        if(msg.mentions.toJSON().users.length != 2){
            msg.channel.send('please mention 2 users')
            return
        }
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
    }
});

b.login('ODA1ODA1MjY3MTEwNDYxNDY0.YBgOog.yFIkYLpwr3sZ-sTMYC-0z6pHAqg');
