# Book Catalog

Frontend для каталога книг. HTTP API эмулируется через MSW, а данные хранятся в IndexedDB через Dexie.

## Запуск

```sh
pnpm install
pnpm api:generate
pnpm dev
```

## Генерация API

```sh
pnpm api:generate
```

Orval читает `book.yaml` и создаёт Fetch-клиент, модели, Faker factories и MSW handler factories в `src/api/generated`.

## Mock API

При первом запуске пустая IndexedDB `bookCatalogMock` заполняется данными.

Повторный запуск не перезаписывает существующие данные. Для программного сброса базы используется функция:

```ts
import { resetMockDatabase } from '@/mocks/db/reset';

await resetMockDatabase();
```
