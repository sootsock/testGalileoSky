Form Builder (Next.js App Router + TypeScript + Tailwind)

Requirements
- Node.js >= 18 (recommended: 20). If you have Node 16, upgrade to run dev server.

Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – run production build

Features
- Builder: add/edit/remove fields (integer, decimal, string, datetime)
- Validations per type, configurable
- Save/load schema to LocalStorage
- Download schema as JSON file and Upload schema from file (validated)
- Fill: render form from schema, validate inputs, show errors, show submitted JSON

How to run
1) Ensure Node >= 18 installed (e.g., `nvm install 20 && nvm use 20`)
2) Install deps: `npm install`
3) Run dev server: `npm run dev`
4) Open http://localhost:3000

Usage
- Go to `/builder` to configure your form
  - Buttons: Add field(s), Save/Load (LocalStorage), Download, Upload
  - Upload validates schema and shows a clear error if invalid
- Go to `/fill` to fill the last saved schema
  - Schema is validated on load; invalid schema is reported

Schema JSON
- The downloaded JSON follows the structure in `lib/types.ts` (`FormSchema`):
  - id: string
  - title: string
  - version: number
  - fields: array of { id, name, label, type, validation }
