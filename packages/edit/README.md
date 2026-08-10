# @tailor-cms/ce-multiple-choice-edit

Authoring component for the **Multiple Choice** content element in [Tailor CMS](https://github.com/tailor-cms/author).

Renders the element inside the Tailor authoring interface, where content is created and edited.

## Installation

```sh
npm install @tailor-cms/ce-multiple-choice-edit
```

## Usage

Content elements are normally registered with Tailor through the element
registry rather than imported directly, but the package can be consumed on its
own:

```ts
import { Edit } from '@tailor-cms/ce-multiple-choice-edit';
```

## Element

| Property | Value |
| --- | --- |
| Name | Multiple Choice |
| Type | `MULTIPLE_CHOICE` |
| Icon | [`mdi-order-bool-ascending-variant`](https://pictogrammers.com/library/mdi/) |
| Composite | Yes |
| Question | Yes |

## Packages

This element ships as four packages, published together from the
[`ce-multiple-choice`](https://github.com/tailor-cms/ce-multiple-choice) repository:

| Package | Role |
| --- | --- |
| [`@tailor-cms/ce-multiple-choice-manifest`](https://www.npmjs.com/package/@tailor-cms/ce-multiple-choice-manifest) | Shared element definition |
| [`@tailor-cms/ce-multiple-choice-edit`](https://www.npmjs.com/package/@tailor-cms/ce-multiple-choice-edit) | Authoring component |
| [`@tailor-cms/ce-multiple-choice-display`](https://www.npmjs.com/package/@tailor-cms/ce-multiple-choice-display) | End-user component |
| [`@tailor-cms/ce-multiple-choice-server`](https://www.npmjs.com/package/@tailor-cms/ce-multiple-choice-server) | Server-side module |

## Development

```sh
pnpm install
pnpm dev     # start the Content Element Kit runtime
pnpm build   # build all packages
pnpm test    # Playwright end-to-end suite
```

Changes are released with [changesets](https://github.com/changesets/changesets);
run `pnpm changeset` to record one.
