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
2. Init the project with `make init`
4. Fill the `.env` file with your own value
5. Use `make start` to start the bot
6. You can stop with `make stop`

### Prerequisites
- For translation :
    - We use Yandex as translator. The configuration is a bit annoying but it worth it
    - Create your account on Yandex and follow those docs : [Yandex Translate Doc](https://cloud.yandex.com/en/docs/translate/operations/translate) & [Yandex Profile Doc](https://cloud.yandex.com/en/docs/cli/quickstart#initialize)
    - Connect to bot container with `make shell` and run `yc init --cloud-id ${YANDEX_CLOUD_API} --folder-id ${YANDEX_FOLDER_ID}` _(refer to Yandex Profile Doc to retrieve your cloud & folder id)_
    - Get your first temp IAM Token with `yc iam create-token`
    - Copy the command output into your env file
    - ⚠️ information, the IAM_TOKEN expires each 12 hours, the bot will renew it each 8 hours.
    
### Configuration
- For translation :
    - We use Yandex as translator. The configuration is a bit annoying but it worth it !
    - Create your account on Yandex and follow those docs : [Yandex Translate Doc](https://cloud.yandex.com/en/docs/translate/operations/translate) & [Yandex Profile Doc](https://cloud.yandex.com/en/docs/cli/quickstart#initialize)
    - Use the link on the profile doc page to retrieve your oauth token and put it in .env
    - Connect to bot container with `make shell` and run `yc init --cloud-id ${YANDEX_CLOUD_API} --folder-id ${YANDEX_FOLDER_ID}` _(refer to Yandex Profile Doc to retrieve your cloud & folder id)_
    - Get your first temp IAM Token with `yc iam create-token`
    - Copy the command output into your env file
    
### Environment file
```dotenv
# Discord Config Part
TOKEN=Your Bot Token
SERVER_OWNER=The discord id of the user that own the server
BOT_OWNER=The discord id of the user that manage the bot (can be the server owner)
ARRIVAL_CHANN=The channel id where a new member should pop (used for the invitation link)
ADMIN_ROLES=Your admin role id, it will allows users of this group (so considered as admins) to use admins commands
MOD_ROLES=Your moderator role id, it will allows users of this group (so considered as mods) to use mods commands

# Bot Config
PREFIX=Prefix that trigger the commands (e.g: !)

# DB
DATABASE_URL=postgres://postgres:postgres@db/db
```
> 💡 The `ADMIN_ROLES` & `MOD_ROLES` can take more than one role, as your convenience, you just need to separate it with a comma.
```dotenv
ADMIN_ROLES=1234456778899,1222333445567779
MOD_ROLES=12221345544646,123432225456464,1323255433412234
```

### Make commands

- `make test` Run linter
- `make start` Start the bot (include make & make db rules)
- `make stop` Stop the bot
- `make` Build the project
- `make db` Build database
- `make shell` Open a term to bot docker container
- `make clean` Remove dist and coverage files
- `make clean-modules` Remove packages
- `make clean-all` Execute `make clean` and `make clean-modules` and remove docker container
