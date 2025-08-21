# Form Builder / Конструктор форм

[English](#english) | [Русский](#russian)

---

## English

A dynamic form builder application built with Next.js App Router, TypeScript, and Tailwind CSS.

### Requirements
- Node.js >= 18 (recommended: 20). If you have Node 16, upgrade to run dev server.

### Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – run production build
- `npm test` – run unit tests
- `npm run format` – format code with Prettier

### Features
- **Form Builder**: Add/edit/remove fields (integer, decimal, string, datetime)
- **Configurable Validations**: Per field type with customizable rules
- **Schema Management**: Save/load to LocalStorage, download as JSON file, upload from file with validation
- **Form Filling**: Render forms from saved schemas with real-time validation
- **Schema Testing**: Upload and interactively test schemas in the "Check Schema" page
- **Theme Support**: Light/dark mode toggle
- **Toast Notifications**: User-friendly feedback for all actions
- **Active Navigation**: Visual indication of current page
- **Unit Testing**: Jest tests for validation, schema, and storage utilities
- **Code Formatting**: Prettier integration for consistent code style

### How to run
1. Ensure Node >= 18 installed (e.g., `nvm install 20 && nvm use 20`)
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open http://localhost:3000

### Usage
- **Builder** (`/builder`): Configure your form
  - Add fields of different types with validation rules
  - Save/load schemas to LocalStorage
  - Download schema as JSON file
  - Upload schema from file (with validation)
  - Clear schema with confirmation
  - Download & Clear in one action
- **Check Schema** (`/watch`): Test uploaded schemas
  - Upload any schema file
  - Interactive form testing
  - Live validation feedback

### Schema Structure
The schema JSON follows the structure defined in `lib/types.ts`:
```typescript
interface FormSchema {
  id: string;
  title: string;
  version: number;
  fields: FormField[];
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: "string" | "integer" | "decimal" | "datetime";
  validation: ValidationRules;
}
```

---

## Русский

Динамическое приложение для создания форм, построенное на Next.js App Router, TypeScript и Tailwind CSS.

### Требования
- Node.js >= 18 (рекомендуется: 20). Если у вас Node 16, обновите для запуска dev сервера.

### Скрипты
- `npm run dev` – запуск dev сервера
- `npm run build` – production сборка
- `npm start` – запуск production сборки
- `npm test` – запуск unit тестов
- `npm run format` – форматирование кода с Prettier

### Возможности
- **Конструктор форм**: Добавление/редактирование/удаление полей (integer, decimal, string, datetime)
- **Настраиваемые валидации**: Для каждого типа поля с настраиваемыми правилами
- **Управление схемами**: Сохранение/загрузка в LocalStorage, скачивание как JSON файл, загрузка из файла с валидацией
- **Заполнение форм**: Рендеринг форм из сохраненных схем с валидацией в реальном времени
- **Тестирование схем**: Загрузка и интерактивное тестирование схем на странице "Check Schema"
- **Поддержка тем**: Переключение светлой/темной темы
- **Toast уведомления**: Удобная обратная связь для всех действий
- **Активная навигация**: Визуальное указание текущей страницы
- **Unit тестирование**: Jest тесты для валидации, схем и утилит хранения
- **Форматирование кода**: Интеграция Prettier для единообразного стиля кода

### Как запустить
1. Убедитесь, что установлен Node >= 18 (например, `nvm install 20 && nvm use 20`)
2. Установите зависимости: `npm install`
3. Запустите dev сервер: `npm run dev`
4. Откройте http://localhost:3000

### Использование
- **Builder** (`/builder`): Настройка вашей формы
  - Добавление полей разных типов с правилами валидации
  - Сохранение/загрузка схем в LocalStorage
  - Скачивание схемы как JSON файл
  - Загрузка схемы из файла (с валидацией)
  - Очистка схемы с подтверждением
  - Скачивание и очистка одним действием
- **Check Schema** (`/watch`): Тестирование загруженных схем
  - Загрузка любой схемы из файла
  - Интерактивное тестирование формы
  - Живая обратная связь по валидации

### Структура схемы
JSON схема следует структуре, определенной в `lib/types.ts`:
```typescript
interface FormSchema {
  id: string;
  title: string;
  version: number;
  fields: FormField[];
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: "string" | "integer" | "decimal" | "datetime";
  validation: ValidationRules;
}
```
