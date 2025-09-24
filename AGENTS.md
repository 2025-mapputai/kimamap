# Repository Guidelines

## Project Structure & Module Organization
The Expo client sits at the root: entry point `App.tsx` wires navigation, feature screens live in `app/screens`, and reusable UI in `app/components` (e.g. `weather/WeatherWidget.tsx`). Shared configuration stays in `config/` for Supabase, Google Maps, and API URLs. Static media belongs in `assets/`. Process docs and templates live in `docs/` and `templates/`. The AI routing API resides in `server/` with its own TypeScript build.

## Build, Test, and Development Commands
Run `npm install` once at the root and `npm install --prefix server` for the API workspace. `npm run start` boots Metro and Expo Go; use `npm run tunnel` when remote devices connect. `npm run android` and `npm run ios` open simulators. Server work uses `npm run dev --prefix server` for hot reload, `npm run build --prefix server` to emit production JavaScript, and `npm run start --prefix server` for the compiled service.

## Coding Style & Naming Conventions
TypeScript is standard. Retain two-space indentation, double-quoted strings, and PascalCase component names (`MapTop`, `WeatherWidget`). Screen files remain kebab-cased (`map-top.tsx`) and include local styles at the bottom. The server enforces ESLint (`npm run lint --prefix server`); fix automatically with `lint:fix`. Prefer explicit types in `config/` and avoid `any`.

## Testing Guidelines
The API relies on Jest (`npm test --prefix server`). Store specs beside the modules they cover and name them `*.spec.ts`. Prioritize coverage for request validation, Supabase access, and third-party adapters before merging. The Expo client lacks automated tests, so describe manual verification in pull requests until React Native testing is adopted.

## Commit & Pull Request Guidelines
Recent commits are concise and imperative, occasionally pointing to feature branches such as `feature/mypage`. Keep titles under ~50 characters and add body text when rationale needs context. Pull requests should summarize the change, include screenshots for UI updates, list environment keys touched, and share a verification checklist (`npm run start`, `npm test --prefix server`). Keep each PR tightly scoped.

## Environment & Configuration
Runtime settings flow through Expo `EXPO_PUBLIC_*` variables. Define them in `.env` files and restart Expo so `config/env.ts` can validate required keys. Update `config/maps.ts` and `config/supabase.ts` when endpoints shift, and never commit real secrets. The backend reads matching values through `server/.env`; keep URLs aligned across workspaces.
