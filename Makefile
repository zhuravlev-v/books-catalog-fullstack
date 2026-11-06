SHELL := /bin/sh

COMPOSE := docker compose --env-file .env -f compose.yaml
PNPM := pnpm

.DEFAULT_GOAL := help

.PHONY: help env check-env setup-local install generate build dev db-up db-migrate db-seed db-stop db-reset db-shell \
	docker-build up deploy stop down restart logs logs-api logs-web logs-db ps config

help: ## Показать доступные команды
	@awk 'BEGIN {FS = ":.*## "; printf "Usage: make <target>\n\n"} /^[a-zA-Z_-]+:.*## / {printf "  %-16s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

env: ## Создать .env из .env.example, если файл отсутствует
	@test -f .env || cp .env.example .env

check-env:
	@test -f .env || { echo '.env не найден. Выполните: make env'; exit 1; }

setup-local: ## Подготовить проект для локальной разработки
	$(MAKE) env
	$(MAKE) install
	$(MAKE) db-up
	$(MAKE) db-migrate
	$(MAKE) db-seed
	$(MAKE) build

install: ## Установить зависимости проекта
	$(PNPM) install --frozen-lockfile

generate: check-env ## Перегенерировать API-контракт и клиент фронтенда
	$(PNPM) api:generate

build: check-env ## Собрать frontend и backend локально
	$(PNPM) build

dev: check-env db-up ## Запустить БД в Docker и приложения в dev-режиме
	$(PNPM) dev

db-up: check-env ## Запустить PostgreSQL для локальной разработки
	$(COMPOSE) up -d --wait db

db-migrate: check-env ## Применить миграции Prisma
	$(PNPM) db:migrate

db-seed: check-env ## Заполнить БД начальными данными
	$(PNPM) db:seed

db-stop: ## Остановить PostgreSQL
	$(COMPOSE) stop db

db-reset: check-env ## Пересоздать PostgreSQL, применить миграции и начальные данные
	$(COMPOSE) down --volumes
	$(MAKE) db-up
	$(MAKE) db-migrate
	$(MAKE) db-seed

db-shell: ## Открыть psql внутри контейнера PostgreSQL
	$(COMPOSE) exec db sh -lc 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

docker-build: check-env ## Собрать Docker-образы приложения
	$(COMPOSE) build

up: check-env ## Запустить контейнеризированное приложение
	$(COMPOSE) up -d --wait

deploy: check-env ## Собрать и запустить приложение на сервере
	$(COMPOSE) up -d --build --remove-orphans --wait

stop: ## Остановить контейнеры без удаления
	$(COMPOSE) stop

down: ## Остановить и удалить контейнеры, сохранив данные БД
	$(COMPOSE) down

restart: ## Перезапустить контейнеры
	$(COMPOSE) restart

logs: ## Показать логи всех контейнеров
	$(COMPOSE) logs -f

logs-api: ## Показать логи API
	$(COMPOSE) logs -f api

logs-web: ## Показать логи frontend
	$(COMPOSE) logs -f web

logs-db: ## Показать логи PostgreSQL
	$(COMPOSE) logs -f db

ps: ## Показать состояние контейнеров
	$(COMPOSE) ps

config: check-env ## Показать итоговую конфигурацию Docker Compose
	$(COMPOSE) config
