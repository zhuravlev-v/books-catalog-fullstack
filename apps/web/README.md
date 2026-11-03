# Book Catalog

Frontend для каталога книг. HTTP API эмулируется через MSW, а данные хранятся в IndexedDB через Dexie.

## Запуск

```sh
pnpm install
pnpm --dir ../.. api:generate
pnpm dev
```

## Генерация API

```sh
pnpm --dir ../.. api:generate
```

Orval читает `../../packages/api-contract/openapi/book.yaml`, создаёт общий контракт в `../../packages/api-contract/src/generated` и Vue Query client, Faker factories и MSW handler factories в `src/api/generated/endpoints`.

## Mock API

При первом запуске пустая IndexedDB `bookCatalogMock` заполняется данными.

Повторный запуск не перезаписывает существующие данные. Для программного сброса базы используется функция:

```ts
import { resetMockDatabase } from '@/mocks/db/reset';

await resetMockDatabase();
```
