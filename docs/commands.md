# Commands

zdiscord comes preloaded with a fairly sizable set of default command with their own permission levels

#### Table of Contents:

- [Included Commands](#included-commands)
- [Change permissions](#change-permissions)
- [Add commands](#add-commands)
- [Add permission levels](#add-permission-levels)

### Included Commands (52)
Key: *[required] (optional)*

**Standalone Commands:** (25)

`/announcement [message]` - mod+<br>
`/embed complex [channel] [json]` - god<br>
`/embed simple [channel] [message] (title) (image) (thumbnail) (footer) (color)` - god<br>
`/identifiers [id]` - admin+<br>
`/kick [id] (message)` - mod+<br>
`/kickall [message]` - admin+<br>
`/kill [id]` - admin+<br>
`/message [id] [message]` - mod+<br>
`/onlinecount`<br>
`/players` - mod+<br>
`/resource ensure [resource]` - god<br>
`/resource inspect [resource]` - god<br>
`/resource list` - god<br>
`/resource refresh` - god<br>
`/resource start [resource]` - god<br>
`/resource stop [resource]` - god<br>
`/server`<br>
`/screenshot [id]` - god<br>
`/teleport coords [id] [x] [y] [z] (keepVehicle)` - mod+<br>
`/teleport preset [id] [location] (keepVehicle)` - mod+<br>
`/teleport-all coords [x] [y] [z]` - god<br>
`/teleport-all preset [location]` - god<br>
`/whitelist toggle [true/false]` - god<br>
`/whitelist addrole [role]` - god<br>
`/whitelist removerole [role]` - god<br>

**QBCore Commands:** (27)

`/ban [id] [time] [reason]` - admin+<br>
`/clothing-menu [id]` - admin+<br>
`/gang kick [id]` - admin+<br>
`/gang inspect [id]` - admin+<br>
`/gang set [id] [gang] [grade]` - admin+<br>
`/inventory give [id] [item] [count]` - admin+<br>
`/inventory inspect [id]` - admin+<br>
`/inventory take [id] [item] [count]` - admin+<br>
`/jail free [id]` - mod+<br>
`/jail sentence [id] [time]` - mod+<br>
`/job fire [id]` - admin+<br>
`/job inspect [id]` - admin+<br>
`/job set [id] [job] [grade]` - admin+<br>
`/logout [id]` - admin+<br>
`/money add [id] [type] [amount]` - admin+<br>
`/money inspect [id]` - admin+<br>
`/money remove [id] [type] [amount]` - admin+<br>
`/money set [id] [type] [amount]` - admin+<br>
`/permissions add [id] [permission]` - god<br>
`/permissions remove [id]` - god<br>
`/revive [id]` - admin+<br>
`/revive-all` - god<br>
`/time [hour]` - admin+<br>
`/vehicle give [id] [spawncode] (plate)` - god<br>
`/vehicle lookup [plate]` - god<br>
`/weather blackout` - admin+<br>
`/weather set [weather]` - admin+<br>

### Change permissions

I tried to make all the permissions as fair and even as I could with my experience with servers and staffing, if you disagree with them it's quite easy to change.<br>
There's currently only 3 permission tiers (mod, admin, god). Permissions are granted by a hierarchy so "mod" will also mean "admin" and "god" can access them but a command with "god" will only be usable by someone with the "god" role.

1. Go to the `/commands/command-name.js` you want to modify and open it in a text/code editor.
2. Fine the line that looks like `role: "mod",` near the top (usually around line 26)
3. Change what is in the quotes `" "` to the permission you want to access the command. ie. `role: "admin",`
4. save and restart the resource or server.

*Please note that permissions are synced across whole base commands so if you wanted `/money inspect` to be mod+ and `/money add` to be admin+ you'd need to separate them into separate commands to achieve that.*

### Add commands

Adding commands can be really simple if you're familiar with javascript but very confusing otherwise. continue at your own risk and if you do make something cool, consider submitting a pull request and maybe it'll become a part of the default zdiscord commands :)

1. create a new javascript file under `/commands` with the name of your command (all lowercase, no spaces).<br>
*Note: If the command filename starts with `qb-` it will only load if QBCore is detected*

2. Paste in the following base. this is everything REQUIRED for a command to work properly:

    ```js
    module.exports = {
        name: "commandname",
        description: "description of command",

        run: async (client, interaction, args) => {
            return interaction.reply({ content: "The Message that will be sent to back when the command is run" });
        },
    };
    ```
3. If you wanted to make it so only admin or god could run your command you'd add the following 2 lines under your description line:

    ```js
    role: "admin",
    ```

4. If you wanted to be able to accept input from the person submitting the command like an id and a message you'd add the following:

    ```js
    options: [
        {
                name: "id",
                description: "Player's current id",
                required: true,
                type: "INTEGER", // This forces this value to be a number only
        },
        {
                name: "message",
                description: "description for what this message is for",
                required: true, // Setting this to false will make it optional
                type: "STRING",
        },
    ],

    run: async (client, interaction, args) => { // You should already have this from the first part
        // args will be named after the name in options (`args.id`, `args.message`)
        // Do what you want with id and message from here on
    ```

5. If you need further guidance these links should help:<br>
    [discord.js guide](https://discordjs.guide/#before-you-begin) - Great for beginners to discord.js<br>
    [discord.js docs](https://discord.js.org/#/docs/main/stable/general/welcome) - Has almost everything you need to know<br>
    [discord.com command docs](https://discord.com/developers/docs/interactions/application-commands) - specific details about how things work<br>
    [FiveM server functions for JS](https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/server-functions/) - Everything you can do with FiveM from a command<br>
    **This resource itself** - Honestly there's so many features and practices being used actively here in commands and utils that you can take note from or in many cases just copy and paste and use so have at it and don't be afraid to break things to help learn more.. as long as you're not working on a live server while you're breaking things ;)


