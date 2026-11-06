# Books Fullstack

Каталог книг: Vue 3, Vite и TypeScript на frontend; Express и PostgreSQL на backend. Monorepo на pnpm/Turborepo, деплой через Docker Compose и nginx.

## Локальная разработка

```bash
make env       # только при первом запуске; затем настройте .env
make install
make dev
```

При локальной разработке в контейнерах запускаются PostgreSQL и MinIO.

Остановка:

`Ctrl+C`, затем:

```bash
make db-stop
make storage-stop
```

## MinIO

Обложки книг хранятся в S3-совместимом MinIO. Для development и production используются отдельные buckets:

- `books-development` — локальная разработка;
- `books-production` — production.

Для деплоя используется single-node MinIO AIStor Free. Получите бесплатную лицензию в [MinIO AIStor](https://www.min.io/pricing), сохраните её в корне проекта как `minio.license` и не добавляйте файл лицензии в Git.

MinIO запускается через Docker Compose с persistent volume `minio_data`. Сервис `minio-init` автоматически создаёт bucket из `S3_BUCKET`, разрешает анонимное чтение объектов и создаёт отдельного S3-пользователя с доступом только к этому bucket.

Скопируйте `.env.example` в `.env` командой `make env` и заполните backend-переменные:

```env
MINIO_ROOT_USER=books-minio
MINIO_ROOT_PASSWORD=<strong-admin-password>
MINIO_LICENSE_PATH=./minio.license

S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=books-development
S3_ACCESS_KEY_ID=books-api
S3_SECRET_ACCESS_KEY=<strong-api-password>
S3_PUBLIC_BASE_URL=http://localhost:9000/books-development
S3_FORCE_PATH_STYLE=true
S3_MAX_FILE_SIZE=5242880
```

Административные `MINIO_ROOT_*` credentials не передаются API-контейнеру. API обращается к MinIO по внутреннему адресу `http://minio:9000` с отдельными `S3_ACCESS_KEY_ID` и `S3_SECRET_ACCESS_KEY`; локально запущенный API использует `S3_ENDPOINT` из `.env`.

`S3_MAX_FILE_SIZE` задаётся в байтах. Значение по умолчанию ограничивает размер обложки пятью MiB.

Для production deployment задайте production bucket и публичный URL приложения:

```env
S3_BUCKET=books-production
S3_PUBLIC_BASE_URL=https://books.example.com/media
```

Nginx проксирует `/media/` в production bucket MinIO. Порты S3 API и Console привязаны только к `127.0.0.1`; Console не публикуется в интернет.

Single-node MinIO не обеспечивает отказоустойчивость. Для сохранности обложек настройте резервное копирование Docker volume `minio_data`.

`MINIO_ROOT_PASSWORD`, `S3_ACCESS_KEY_ID` и `S3_SECRET_ACCESS_KEY` доступны только инфраструктуре и API-контейнеру. Не добавляйте credentials или другие `S3_*` значения в `VITE_*` переменные: все `VITE_*` значения встраиваются во frontend bundle.
