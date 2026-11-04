# API endpoint rules

- Сначала обновляй OpenAPI-контракт и регенерируй `@books/api-contract`.
- Группируй endpoints по модулю и use case: `<module>/<use-case>/`.
- Используй одинаковые файлы use case: `controller.ts`, `model.ts`, `view.ts`.
- `routes.ts` только связывает URL, middleware и controller.
- Controller валидирует request через contract-схемы, вызывает Model и отправляет View.
- Model содержит Prisma-запросы, транзакции и бизнес-правила; не зависит от Express.
- View преобразует данные в OpenAPI DTO и валидирует результат через `defineMapper`.
- Общие Prisma-типы и presenters размещай в `<module>/shared/`.
