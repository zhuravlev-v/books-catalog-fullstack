# Books Fullstack

Каталог книг: Vue 3, Vite и TypeScript на frontend; Express и PostgreSQL на backend. Monorepo на pnpm/Turborepo, деплой через Docker Compose и nginx.

## Локальная разработка

```bash
make env       # только при первом запуске; затем настройте .env
make install
make dev
```

При локальной разработке в контейнере запускается только ДБ

Остановка: 

`Ctrl+C`, затем:

```bash
make db-stop
```
