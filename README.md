# U*Travel Helper Discord
__(readme in construction)__

_For the discord community U*Travel ([Discord Server](https://discord.gg/Evd7mgdMZ2))_
*U\*Travel Community* is a community base on astronomy and science. This bot will go in these purposes.

I will create some commands related to space, like getting live data from ISS, getting information about a celestial object,
or getting some cronjob that every day will go on NASA website to take the picture of the day.

There'll also have some mods commands like mute that works 100% without this missing discord rights hierarchy.
(The user will lose all this ranks and will be saved and have a muted one (that you need to configure for each channel/category))
So the user haves only one role, muted with restricted permission.
Then when you unmute him, he just got back his roles, and he's removed from mute role

## Setup

### Development environment

1. Install Docker
2. Install the dependencies with `docker-compose run bot npm i`
3. Copy `.env` from `.env-example` and fill in the credentials
4. You can run the stack by running `docker-compose up -d`
5. To check the logs you can either attach your shell to the process with `docker attach bot` or use VS Code Debugger
6. Stop containers with `docker-compose down`

### Environment file
```dotenv
# Discord Config Part
TOKEN=Your Bot Token
SERVER_OWNER=The discord id of the user that own the server
BOT_OWNER=The discord id of the user that manage the bot (can be the server owner)
ARRIVAL_CHANNEL_ID=The channel id where a new member should pop (used for the invitation link)
ADMIN_ROLES_ID=Your admin role id, it will allows users of this group (so considered as admins) to use admins commands
MOD_ROLES_ID=Your moderator role id, it will allows users of this group (so considered as mods) to use mods commands

# Bot Config
PREFIX=Prefix that trigger the commands (e.g: !)

# DB
DATABASE_URL=postgres://postgres:postgres@db/db
```
> 💡 The `ADMIN_ROLES_ID` & `MOD_ROLES_ID` can take more than one role, as your convenience, you just need to separate it with a comma.
```dotenv
ADMIN_ROLES_ID=1234456778899,1222333445567779
MOD_ROLES_ID=12221345544646,123432225456464,1323255433412234
```

### Useful commands

- `docker-compose up -d` Runs containers
- `docker-compose down` Shuts down containers
- `docker-compose run bot <command>` Runs a command in the node container (bot)
