---
name: avoid-over-engineering
description: >-
  Enforces restraint when writing or editing code. Cut unnecessary defensive
  checks (null/undefined guards the types already guarantee), redundant comments,
  premature abstraction, speculative "just in case" code, and needless layering —
  while keeping the safety that genuinely matters. Consult this whenever
  generating, writing, or reviewing code, and specifically BEFORE adding a guard,
  a comment, a wrapper, an abstraction, a config option, or an extra branch. Use
  it as the default lens for all code in this project: the failure it prevents is
  code that is larger, more cautious, and more abstract than the problem requires.
---

# Avoid Over-Engineering

The default failure mode of generated code is doing too much: extra guards,
extra comments, extra layers, extra flexibility nobody asked for. Match the
solution to the problem. When unsure, write less. Deleting code is a valid and
often correct outcome.

## The line that decides everything: guard the edges, trust the inside

Most "should I add a check?" questions resolve with one rule:

- **Boundaries with untrusted/external data → validate.** API responses,
  user input, environment variables, file/network reads, third-party payloads.
  Here, defensive checks and parsing (e.g. Zod) are correct and required.
- **Internal, type-guaranteed values → trust the types.** Once data has crossed
  a validated boundary, do not re-check what TypeScript already proves. Adding
  runtime guards for type-impossible cases is noise, not safety.

If you're tempted to add a check, first ask: *can this actually be null/invalid
here, given the types and where the value came from?* If the type says it can't,
don't guard it.

## Defensive checks: cut these

- Null/undefined guards on values the types guarantee are present.
- Optional chaining sprinkled "just in case" (`a?.b?.c`) when `a` and `b` are
  known non-null. Use `?.` only where the value is genuinely optional.
- Default fallbacks for branches that cannot occur.
- `typeof` / `Array.isArray` guards on already-typed internal values.
- `try/catch` that only logs and rethrows, or wraps code that can't meaningfully
  throw. Catch only when you will actually handle the error.
- Re-validating data already validated at the boundary.

```ts
// Over-engineered
const getName = (user: User) => {
  if (!user) return "";            // User is non-null by type
  if (!user.name) return "";       // name: string — can't be undefined
  return user.name;
};

// Right
const getName = (user: User) => user.name;
```

Keep the check when the value is genuinely nullable (`User | null`,
`string | undefined`, an array index, a `Map.get`, a JSON field before parsing).

## Comments: cut these

- Comments that restate what the code plainly does.
- Redundant JSDoc that duplicates the TypeScript signature.
- Decorative banners, section dividers, and `// ---` noise.
- Commented-out code — delete it; that's what git is for.
- Bare `// TODO` with no context.

```ts
// Over-commented
// increment the counter by one
counter += 1;

// loop over the users
users.forEach(...)
```

Keep comments that explain **why**, not **what**: a non-obvious business rule, a
workaround and the reason for it, a deliberate trade-off, or a warning about a
subtle constraint. If the code needs a comment to explain *what* it does, prefer
making the code clearer (better name, smaller function) over adding the comment.

## Premature abstraction & speculative generality (YAGNI)

- Don't extract a function, hook, or component used exactly once.
- Don't build a generic/parameterized solution for a single concrete case.
- Don't add config options, flags, or parameters "for flexibility" nobody asked
  for.
- Don't create an interface/abstraction with one implementation — **except** the
  project's real volatile vendor boundaries (the backend's ports/adapters),
  which are a deliberate, justified exception.
- Apply the **rule of three**: wait until you have three real uses before
  extracting the shared shape. Two similar blocks are not yet a pattern.
- Build for the requirement in front of you, not an imagined future one.

## Indirection, layering, and verbosity: cut these

- Pass-through layers that only forward a call without adding value.
- Barrel/re-export files that add a hop for no benefit.
- Deeply nested folders for a tiny feature.
- Intermediate variables that don't improve readability.
- Restating types that infer perfectly well.
- Long if/else ladders where an early return or a lookup map is clearer.

## React / React Native restraint

- No `useMemo` / `useCallback` without a real, identified performance reason.
  Premature memoization adds noise and its own bugs.
- Don't wrap everything in `React.memo`.
- Don't lift state higher than it needs to live; don't reach for global state
  (or Context) for what is local component state.
- No custom hook for a one-line wrapper.
- No `useEffect` for derived state (compute it) or for data fetching (use the
  query layer).

## What is NOT over-engineering (do not strip these)

- Validation/parsing of external input (API, user, env, files) — required.
- The ports/adapters abstraction at genuine vendor boundaries — deliberate.
- Error handling for operations that really can fail (network, IO, parsing).
- `why` comments for non-obvious logic, business rules, and workarounds.
- Accessibility, security, and correctness handling.
- Tests.

Restraint means cutting the *unnecessary*, not the *necessary*. When a check or
abstraction earns its place, keep it.

## Default checklist before adding code

Before adding a guard, comment, abstraction, layer, or option, ask:
1. Can this case actually occur given the types and the data's origin? If not —
   don't add the guard.
2. Does this comment explain *why*, or just restate *what*? If *what* — delete it
   or improve the code instead.
3. Is this abstraction used three times for real, or am I guessing at the future?
   If guessing — inline it.
4. Does this layer/option add value now, or is it "just in case"? If just in
   case — leave it out.
