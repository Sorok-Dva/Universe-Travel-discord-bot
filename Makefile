NAME=discord-bot
PROJECT=ustar_travel/${NAME}
BOT_CONTAINER=ustar_travel-${NAME}

PACKAGE_LOCK = package-lock.json
COVERAGE = .nyc_output coverage
SRC = src
DIST = dist
ENVFILE = .env
LOCALCONFIG = src/config.local
MODULES = node_modules

D = docker
DC = docker-compose
DNAME = discord-bot
DCFLAGS = --rm $(DNAME)

SED ?= sed
UNAME_S = $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
	SEDFLAGS ?= -i '' -E
else
	SEDFLAGS ?= -i -r
endif

# TODO: improve with an OR logical - not available in make as a standard
PM = $(DC) run $(DCFLAGS) npm
RM = $(DC) run $(DCFLAGS) rm
ifneq (,$(wildcard /.dockerenv))
	ifneq (,$(CI))
		PM = $(DC) run $(DCFLAGS) npm
		RM = $(DC) run $(DCFLAGS) rm
	else
		PM = npm
		RM = rm
	endif
endif

ifneq (,$(wildcard $(ENVFILE)))
	include $(ENVFILE)
	export $(shell sed 's/=.*//' $(ENVFILE))
endif

$(ENVFILE):
	cp $(ENVFILE).defaults $(ENVFILE)

.PHONY: init
init: .env src/config.local build
	echo "Project initiated, please read README.md file to complete your .env value then execute make ycinit"

.PHONY: build
build:
	$(PM) run build

.PHONY: restart
restart: stop build db start

.PHONY: env
env:
	cp .env.defaults .env

$(LOCALCONFIG):
	cp -a $(SRC)/config $(LOCALCONFIG)

$(MODULES):
ifeq (,$(wildcard /.dockerenv))
	$(DC) build
endif
	$(PM) ci

$(DIST): $(MODULES)
	$(PM) run build

.PHONY: clean
clean:
	$(RM) -rf $(DIST) $(COVERAGE)

.PHONY: clean-modules
clean-modules:
	$(RM) -rf $(MODULES)/*
	$(RM) $(PACKAGE_LOCK)

.PHONY: clean-all
clean-all: clean clean-modules
	$(DC) down -v --remove-orphans --rmi local

.PHONY: start
start: $(ENVFILE) $(LOCALCONFIG) $(MODULES) db
	$(DC) up

.PHONY: stop
stop:
	$(DC) down

.PHONY: ycinit
ycinit: $(ENVFILE) $(LOCALCONFIG)
	$(DC) exec -it $(BOT_CONTAINER) bash "yc init --no-user-output --token $(YANDEX_OAUTH) --cloud-id $(YANDEX_CLOUD_API) --folder-id $(YANDEX_FOLDER_ID)"

.PHONY: test
test: $(ENVFILE) $(LOCALCONFIG) $(MODULES)
	$(PM) t

coverage:
	$(PM) run coverage

package-lock.json: clean-modules
	$(PM) i

.PHONY: release
release: PM = npm
release: $(DIST)
ifneq (,$(findstring n,$(MAKEFLAGS)))
	+$(PM) run release -- --dry-run
else
	$(PM) run release
	git push --follow-tags origin master
endif

.PHONY: db
db:
	$(PM) run db

.PHONY: dbdown
dbdown:
	$(PM) run db:init:build:create

.PHONY: dbshell
dbshell:
	$(DC) run $(DCFLAGS) psql db

.PHONY: dbrestore
dbrestore: dump.sql dbdown
	$(DC) run $(DCFLAGS) \
		/bin/sh -c "cat dump.sql | psql db"
	$(PM) run db:build:migrations

.PHONY: dbdump
dbdump:
	$(DC) run /bin/sh -c "pg_dump db > dump.sql"

.PHONY: shell
shell:
	$(DC) run $(DNAME) bash

PHONY: dcbuild
dcbuild:
	$(DC) run $(DCFLAGS) npm run build
