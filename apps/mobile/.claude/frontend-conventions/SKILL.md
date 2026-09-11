---
name: frontend-conventions
description: Coding conventions and architectural rules for a React + TypeScript frontend codebase (Jotai for client state, React Query for server state, Zod/Yup for schemas). Covers naming, barrel files, TypeScript typing rules, the layered architecture (UI / Business / Data / API / State / Model / Storage), the UI-vs-Business component distinction, file organization, constants, the new-library process, and state-management best practices. Use this skill whenever creating, editing, structuring, or reviewing React/TypeScript components, hooks, types, stores, or feature folders in this project — even when the user only says "add a component", "write a hook", "set up types", "fetch this data", or "organize this feature" without explicitly mentioning conventions or a style guide. Apply it any time you write frontend code that should match the team's standards.
---

# Frontend Conventions

These are the team's conventions for a React + TypeScript codebase. Follow them whenever you write, restructure, or review frontend code so output matches the existing project. When reviewing code, flag violations and suggest the conforming version.

The guiding principles: strict separation of concerns between layers, consistent naming, explicit typing where it documents intent, and keeping state and logic close to where they're used. When a request leaves a detail unspecified, default to whatever these rules imply rather than inventing a new pattern.

## 1. Naming

Names signal scope and role. Pick the rule that matches the symbol's scope:

- **Global / shared** (components, hooks, utils reused across modules): generic, descriptive names. `Button`, `useDebounce`, `formatDate`.
- **Module-scoped** (lives inside one domain/module): prefix with the module name to avoid collisions. `UserProfileCard`, `useUserProfile`, `getUserInitials`.
- **Event handlers** (callbacks for clicks, changes, submits): prefix with `handle` + action. `handleSubmitForm`, `handleClickButton`, `handleChangeInput`.
- **Constants** (config, limits, fixed values): `ALL_CAPS_WITH_UNDERSCORES`. `MAX_UPLOAD_SIZE_MB`, `DEFAULT_THEME`, `API_BASE_URL`.

## 2. Barrel files

Barrel files (`index.ts`) are for re-exporting only — never for defining. Keeping the implementation in its own file keeps each component self-contained and easy to maintain.

```ts
// components/Button.tsx  — implementation lives here
export function Button() {
  return <button>Click me</button>
}

// components/index.ts  — re-export only
export { Button } from './Button'
```

## 3. TypeScript typing

Typing exists to catch errors early, document intent, and improve the developer experience — type for clarity, not ceremony.

**General**

- Prefer `type` over `interface` for most cases: component props, utility types, object shapes.
- Use `interface` only when extending objects or modelling class-like structures.
- Never use `any`. Reach for `unknown`, `never`, or generics instead.

**Component props** — name them `ComponentNameProps` and use `type`:

```ts
type ButtonProps = {
  label: string
  onClick?: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

**API types / DTOs** — name them `XxxRequest`, `XxxResponse`, or `XxxDTO`:

```ts
type LoginRequest = { email: string; password: string }
type LoginResponse = { token: string; user: UserDTO }
```

**Unions & enums** — prefer literal unions over `enum` unless you need runtime behavior:

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' // preferred
```

**Utility types** — prefer the built-ins (`Partial<T>`, `Omit<T, K>`, `Pick<T, K>`, `Record<K, V>`) over hand-rolled equivalents.

**Always type:** component props (`ComponentNameProps`); parameters of public/shared functions; return types of public/exported functions; API request/response DTOs; app state shape and updater actions (e.g. Jotai); custom hook inputs and return types; context values; third-party API responses and SDK inputs/outputs.

**Let inference work (don't over-annotate):** `useState` initial values (unless complex); inline anonymous functions (unless inference fails); local variables; return types of internal/private functions when obvious.

## 4. Component classification

Decide whether something is a **UI component** or a **Business component** before placing it — the answer determines its folder and what it's allowed to do.

**UI component** — generic, reusable, presentation-only.

- Only renders UI; takes props and emits callbacks.
- Knows nothing about app state, routes, or APIs; reusable across modules.
- Lives in `src/shared/components`.
- Examples: `Button`, `Card`, `Input`, `Modal`, `Avatar`, `Skeleton`.
- Anti-patterns: calling APIs, reading context, conditional business logic, hardcoded or domain-specific text.

**Business component** — feature-aware, orchestrates logic/state/domain behavior.

- May fetch data, use stores (Jotai), and handle side effects.
- Assembles UI components into a feature section; tied to one module (Auth, User, Checkout, etc.).
- Lives in `src/modules/[module]/components`.
- Examples: `ProfileSection`, `UserDetailsCard`, `ProductCheckoutSteps`, `TeamInviteForm`.
- Anti-patterns: living in shared/common folders; being reused across unrelated modules unless genericized first.

## 5. Layered architecture

Each layer has a single responsibility and talks only to the layer directly above or below it — never skip or cross boundaries. This is what keeps the codebase scalable and testable.

| Layer            | Responsibility                               | May use                                                                           |
| ---------------- | -------------------------------------------- | --------------------------------------------------------------------------------- |
| **UI**           | Pure presentational components               | UI components, styling, props — no data/state management                          |
| **Business**     | Feature/domain logic; composes UI components | React Query hooks, local state, business utils                                    |
| **Data**         | Fetch/cache/mutate/sync via React Query      | API layer only; returns usable data to Business                                   |
| **API**          | Raw REST/GraphQL calls                       | `fetch`/Axios with error handling — no formatting or transforms                   |
| **State**        | Client-only global state (Jotai/Redux)       | Consumed by UI/Business; side-effect free; never fetches                          |
| **Model/Schema** | Types, enums, Zod/Yup schemas, constants     | Usable by any layer, especially API and Business                                  |
| **Storage**      | Wraps localStorage/sessionStorage/cookies    | Simple get/set/remove; called only from Business or State — never from components |

**Don't:** call APIs or React Query hooks inside UI components; touch the DOM directly from Business/Data; call `localStorage` directly from a component or hook; put business logic in the API layer; skip layers (UI → API).

**Do (typical file placement):**

- `shared/ui/` → pure components (`Button`, `Card`, `Input`).
- `modules/user/components/ProfileSection.tsx` → business logic + UI.
- `hooks/queries/useGetUser.ts` → React Query fetching.
- `services/api/userApi.ts` → Axios/fetch wrappers.
- `storage/tokenStorage.ts` → token persistence.
- `types/user.ts` and `schemas/user.ts` → types and validation.

## 6. File rules

- One component per file (`LoginForm.tsx` contains only `LoginForm`).
- File name matches the component name (`UserCard.tsx` → `export const UserCard = ...`).
- Named exports only — no default exports.

## 7. Constants

Never leave magic strings, numbers, or values inline in logic or JSX — name them. It improves readability and removes the bug risk of repeated magic values.

- Shared constants → a centralized `constants/` folder.
- Module-specific constants → a `constants.ts` inside that module's folder.

## 8. State management

State is the highest-leverage and most bug-prone part of the app. Keep it clean and predictable:

- **One responsibility per `useEffect`.** Don't bundle fetching + syncing + updating in one effect.
- **Don't scatter global-state updates.** Centralize updates at the most appropriate level (store / context / dedicated hook) rather than mutating shared state from many components.
- **Local vs global.** Use `useState`/`useReducer` for component/UI-specific state (modal visibility, form toggles). Reach for global state (Jotai/Redux/Context) only when something is truly app-wide.
- **React Query owns server state.** Don't copy fetched data into global state unless absolutely necessary.
- **Avoid derived state.** Compute it with selectors or memoization (`useMemo`/`useCallback`) instead of duplicating.
- **Co-locate state with usage.** Keep state close to the feature that uses it; don't lift it up unless needed.

Common mistakes to avoid: updating the same global state from `useEffect` in several components; using global state for modal/form toggles; fetching the same data in multiple components instead of fetching once and passing it down.

## 9. Adding a new library

A new dependency is a long-term commitment — treat it deliberately:

- **Discuss first.** Raise a proposal, explain why existing tools fall short and what the library solves, and get team alignment before adding it.
- **Be future-proof.** Prefer actively maintained, well-documented, widely-adopted libraries. Avoid obscure or abandoned ones even if they're a quick fix.
- **Evaluate before installing.** Consider native browser features, internal utilities, or existing packages first. Check bundle size and tree-shaking, and confirm compatibility with the stack (TypeScript, Next.js, etc.).
- **Keep it minimal.** Don't pull in a dependency for a trivial problem — write a small utility instead.
- **Document it.** After installing, note in the project docs why it was added and when it should be used.
