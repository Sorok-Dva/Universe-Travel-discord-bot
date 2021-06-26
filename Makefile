#!make
NAME=discord-bot
PROJECT=ustar_travel/${NAME}

PACKAGE_LOCK = package-lock.json
COVERAGE = .nyc_output coverage
SRC = src
DIST = dist
ENVFILE = .env
MODULES = node_modules

D = docker
DC = docker-compose
DCFLAGS = --rm bot

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

.PHONY: all
all: clean $(DIST)

$(ENVFILE):
	cp $(ENVFILE).defaults $(ENVFILE)

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
start: $(ENVFILE) $(LOCALCONFIG) $(MODULES)
	$(DC) up

.PHONY: test
test: $(ENVFILE)  $(MODULES)
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
	$(PM) run db:seeds:up

.PHONY: dbclean
dbclean:
	$(PM) run db:build:drop

.PHONY: dbdown
dbdown:
	$(PM) run db:build:drop
	$(PM) run db:build:create

.PHONY: dbconnect
dbconnect:
	$(DC) run $(DCFLAGS) psql $(DATABASE_URL)_$(NODE_ENV)

.PHONY: dbrestore
dbrestore: dump.sql dbdown
	$(DC) run $(DCFLAGS) \
		/bin/sh -c "cat dump.sql | psql $(DATABASE_URL)_$(NODE_ENV)"
	$(PM) run db:build:migrations

.PHONY: shell
shell:
	$(DC) run $(DCFLAGS) bash
