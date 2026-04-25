# Multiple Choice

Gradable multiple choice question element. Learners select one or more correct
answers from a list of options.

**Type:** `MULTIPLE_CHOICE`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `question` | `string[]` | Embedded question (Tiptap HTML) element ids |
| `embeds` | `Record<string, any>` | Embedded element map keyed by id |
| `answers` | `string[]` | Answer option labels |
| `correct` | `number[]?` | Indexes of correct answers (gradable only) |
| `feedback` | `Record<number, string>` | Optional per-answer feedback keyed by index |
| `hint` | `string` | Optional hint shown to the learner |
| `isGradable` | `boolean?` | Whether the question is graded |

## Edit

- Question prompt area (embedded Tiptap element)
- Answer list with inline add/remove controls
- Checkbox per answer to mark correct option(s) when gradable
- Numbered avatar per answer when not gradable (plain options)
- Requires at least two answers
- Hint field (question form)

## Display

- Options rendered as selectable cards with letter avatars (A, B, C, ...)
- Multiple-select: learner toggles one or more options
- On submit, selected options are color-coded as correct (green) or incorrect (red)
- Retry restores the initial state

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```
