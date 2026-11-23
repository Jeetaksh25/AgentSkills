---
disable-model-invocation: true
name: shadcn-components
description: Consult when building React UI with shadcn/ui — pick the right component, compose its compound parts, wire variants/props, and avoid common AI-slop patterns.
---

# shadcn/ui Component Reference

A self-contained reference for assembling production UI with shadcn/ui. Use this when you are about to scaffold a component, pick between overlapping primitives (Dialog vs Sheet vs Drawer, Command vs Combobox, Select vs Native Select), or wire up forms, data tables, and command palettes. The goal is fast, correct, idiomatic assembly — not copy-pasting blindly.

## When to invoke

Invoke this skill when any of these are true:

- You are about to write or modify a component that ships in shadcn/ui (Button, Card, Dialog, Sheet, Command, DataTable, Form, etc.).
- You need to decide *which* primitive fits a requirement (overlay vs slide-over, menu vs command palette, select vs combobox).
- You are configuring theming tokens, dark mode, or radius.
- You are reviewing shadcn/ui code for anti-patterns (wrong variant, broken compound composition, missing `data-invalid`/`aria-invalid`, etc.).

Do NOT invoke for: general Tailwind questions, non-shadcn Radix usage, or building a design system from scratch (shadcn is copy-in components, not a dependency).

## Core principles

1. **Copy-in, not dependency.** shadcn/ui components live in your `components/ui/` tree. You own and edit them. The CLI (`shadcn@latest add <name>`) drops source into your project; it is not an npm runtime dependency. This means you can — and should — tweak them per-project.

2. **Compound composition.** Most components are families: `Card`/`CardHeader`/`CardTitle`/`CardContent`/`CardFooter`. You import and compose only the parts you need. Never wrap a sub-component in a parent that re-implements what the parent already provides.

3. **Semantic CSS-variable tokens, not hard-coded colors.** Components reference tokens (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, `ring-ring`). Theme by overriding CSS variables in `:root` / `.dark`, never by editing component classes to use `bg-zinc-900` etc. See the **Theming** section below.

4. **`cva` class variants for size/shape.** Interactive components expose `variant` and `size` props driven by `class-variance-authority`. Reach for the documented variant names; only invent new ones by editing the source `cva` config.

5. **Built on accessible primitives.** Overlays/menus/selects sit on Base UI / Radix primitives (depending on your `components.json` `base` setting: `base`, `radix`, or `aria`). Focus trapping, `aria-*`, keyboard nav, and dismiss-on-outside-click are inherited — do not re-implement them.

6. **`cn()` for className merging.** The `cn` utility (clsx + tailwind-merge) merges classes with conflict resolution. Pass overrides via `className` props; they win over defaults.

## Installation & CLI

Initialize once, then add components per-need.

```bash
# Initialize (creates components.json, cn util, CSS vars, base deps)
pnpm dlx shadcn@latest init -t next      # templates: next | vite | start | react-router | laravel | astro
pnpm dlx shadcn@latest init --pointer   # restore cursor:pointer on buttons (Tailwind v4 defaulted to default)
pnpm dlx shadcn@latest init -b base      # base library: base | radix | aria

# Add components (drops source into components/ui/<name>.tsx)
pnpm dlx shadcn@latest add button card dialog sheet command
pnpm dlx shadcn@latest add table        # data-table also needs: pnpm add @tanstack/react-table

# Useful flags
shadcn@latest add <name> -o          # overwrite existing
shadcn@latest add <name> --dry-run   # preview
shadcn@latest add <name> --diff      # show diff vs existing
shadcn@latest add -a                 # add ALL components
shadcn@latest docs <component>       # fetch the latest component doc inline
```

`components.json` (created by `init`) holds `style`, `tailwind.css`, `tailwind.baseColor`, `iconLibrary`, `rtl`, and path aliases. The CLI reads it on every `add`.

## Theming & tokens

Tokens are **OKLCH** color-space CSS variables, exposed to Tailwind via `@theme inline { --color-background: var(--background); ... }`, producing utilities like `bg-background`, `text-primary`, `border-border`, `ring-ring`.

### Core token pairs (surface + its foreground)

| Pair | Use |
|---|---|
| `background` / `foreground` | Default app surface + text |
| `card` / `card-foreground` | Cards, elevated panels |
| `popover` / `popover-foreground` | Popovers, dropdown menus |
| `primary` / `primary-foreground` | High-emphasis actions, brand |
| `secondary` / `secondary-foreground` | Lower-emphasis filled actions |
| `muted` / `muted-foreground` | Subtle surfaces, descriptions, placeholders |
| `accent` / `accent-foreground` | Hover/focus/active states |

### Single tokens (no foreground pair)

- `destructive` — error/destructive emphasis
- `border` — default borders/separators
- `input` — form control borders
- `ring` — focus rings/outline

Plus `chart-1`..`chart-5` and a dedicated `sidebar-*` set.

### Radius

`--radius` is the base; a derived scale auto-computes `--radius-sm/md/lg/xl/...4xl`. Change `--radius` once to rescale corners app-wide.

```css
:root { --radius: 0.625rem; }
@theme inline {
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}
```

### Dark mode

Same token names, overridden under `.dark`:

```css
@custom-variant dark (&:is(.dark *));   /* in globals.css */
:root { --background: oklch(1 0 0); }
.dark  { --background: oklch(0.145 0 0); }
```

Toggle the `.dark` class on the root element via a theme provider (`next-themes` for Next.js). Never write `dark:bg-zinc-900` into component source if CSS variables are on — `--no-css-variables` is an init-time choice; toggling it requires re-install.

### Adding a custom token

```css
:root { --warning: oklch(0.84 0.16 84); }
.dark  { --warning: oklch(0.41 0.11 46); }
@theme inline { --color-warning: var(--warning); }
/* now usable: bg-warning, text-warning-foreground */
```

## Component catalog (when-to-use + anatomy)

See `references/component-catalog.md` for the full per-component cheat sheet (all ~60 components, anatomy trees, variant tables, props). The most-used ones are summarized here.

### Button — `components/ui/button`

For any interactive action trigger. Variants drive visual weight.

| Variant | When |
|---|---|
| `default` | Primary action (filled, brand/primary) |
| `secondary` | Alternative action, lower emphasis |
| `destructive` | Delete/remove/danger (red) |
| `outline` | On filled backgrounds; bordered, transparent |
| `ghost` | Tertiary, toolbar, row-action; no border/bg, hover only |
| `link` | Inline link-styled CTA |

Sizes: `default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`. Use `icon` family for square icon-only buttons.

```tsx
import { Button, buttonVariants } from "@/components/ui/button"

<Button variant="outline" size="sm">Save</Button>
<Button variant="ghost" size="icon" aria-label="Toggle"><MenuIcon /></Button>

{/* icon spacing: tag icons with data-icon for correct gap */}
<Button>
  <IconGitBranch data-icon="inline-start" />
  New Branch
</Button>

{/* loading state */}
<Button disabled><Spinner data-icon="inline-start" /> Generating</Button>

{/* as a link: do NOT use <Button render={<a/>}/> — Base UI forces role=button */}
<a className={buttonVariants({ variant: "outline" })} href="/login">Login</a>
```

Tailwind v4 changed buttons to `cursor: default`. To restore pointer, either `init --pointer` or add:

```css
@layer base {
  button:not(:disabled), [role="button"]:not(:disabled) { cursor: pointer; }
}
```

### Card — `components/ui/card`

Compound component for grouped content (forms, previews, panels).

```
Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction        ← top-right slot (button/badge)
├── CardContent
└── CardFooter
```

- `size="sm"` tightens spacing.
- `--card-spacing` CSS var unifies insets; override per-card with `[--card-spacing:--spacing(6)]`.
- Edge-to-edge content: `-mx-(--card-spacing)` on children; above a footer use `-mb-(--card-spacing)`.
- Top image: put `<img>` as the **first child** (before `CardHeader`) → auto rounded top corners.

### Dialog — `components/ui/dialog`

Centered overlay window; content beneath becomes inert. For confirmations, modal forms, focused workflows.

```
Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    └── DialogFooter          ← sticky footer for action buttons
```

- `showCloseButton={false}` hides the default X.
- Long body scrolls while header stays fixed; use sticky footer for action buttons.
- Always provide `DialogTitle` (a11y) — even if visually hidden.

### Sheet — `components/ui/sheet`

Slide-over panel from one screen edge. Extends Dialog. For navigation, filters, settings, auxiliary content that should not replace the main view.

```
Sheet
├── SheetTrigger
└── SheetContent  (side: top | right | bottom | left, showCloseButton)
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription
    └── SheetFooter
```

**Choose between overlays:**
- **Dialog** → centered modal, focused confirmation/form.
- **Sheet** → edge slide-over, contextual/supplementary panel.
- **Drawer** → bottom sheet (mobile-first, drag-to-dismiss).
- **Popover** → non-modal, positioned to a trigger, no scrim.
- **Hover Card** → preview on hover, no focus trap, dismisses on leave.

### Command — `components/ui/command` (built on `cmdk`)

Command palette / searchable action menu — the ⌘K pattern.

```
Command
├── CommandInput
└── CommandList
    ├── CommandEmpty          ← "No results found."
    ├── CommandGroup heading="…"
    │   └── CommandItem       ← optional <CommandShortcut>⌘P</CommandShortcut>
    └── CommandSeparator
```

- `CommandDialog` wraps `Command` inside a Dialog for the classic ⌘K overlay.
- Built-in arrow-key nav + type-to-filter from `cmdk`.
- Compose with `Popover` for a combobox: `<Popover>` → `<PopoverTrigger>` → `<PopoverContent>` containing `<Command>` with `shouldFilter` to control filtering yourself when using async search.

### Data Table — guide, not a single component

Built on **TanStack Table** (headless) + shadcn `<Table>` primitives. Every table is bespoke; the docs ship a pattern, not a black box.

Install: `shadcn add table` + `pnpm add @tanstack/react-table`.

Project layout:
```
app/payments/
├── columns.tsx      # ColumnDef[] (client)
├── data-table.tsx   # DataTable<TData,TValue> (client)
└── page.tsx         # fetch + render
```

Wire **state + row models** into `useReactTable`:
- `onSortingChange` + `getSortedRowModel()` → sortable columns
- `onColumnFiltersChange` + `getFilteredRowModel()` → filterable columns
- `getPaginationRowModel()` → pagination (default 10/page)
- `onColumnVisibilityChange` (`VisibilityState`) → hide/show columns
- `onRowSelectionChange` (`Record<string,boolean>`) → row selection

Render headers/cells via `flexRender(header.column.columnDef.header, header.getContext())` and `flexRender(cell.column.columnDef.cell, cell.getContext())`. Mark selected rows with `data-state={row.getIsSelected() && "selected"}`.

Sortable header pattern, row-action dropdown (using `row.original`), select-all checkbox header (`getIsAllPageRowsSelected()` / indeterminate via `getIsSomePageRowsSelected()`), and filter `<Input>` bound to `table.getColumn("email")?.getFilterValue()` are all standard. See the catalog reference for full code.

Extract `DataTableColumnHeader`, `DataTablePagination`, `DataTableViewOptions` once you reuse the table across pages.

### Form — `components/ui/field` + react-hook-form + zod

> Note: current shadcn uses the **`<Field/>` + `<Controller/>`** pattern, NOT the older `Form/FormField/FormItem` wrapper family.

Install: `pnpm add react-hook-form @hookform/resolvers zod`.

```tsx
const formSchema = z.object({
  title: z.string().min(5, "Must be at least 5 characters.").max(32),
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { title: "" },
  mode: "onChange",   // onChange | onBlur | onSubmit | onTouched | all
})

<form onSubmit={form.handleSubmit(onSubmit)}>
  <FieldGroup>
    <Controller name="title" control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Title</FieldLabel>
          <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )} />
    <Button type="submit">Submit</Button>
  </FieldGroup>
</form>
```

**Wiring rules that are easy to get wrong:**
- `data-invalid` goes on `<Field/>` (drives error styling).
- `aria-invalid={fieldState.invalid}` goes on the **control** (`Input`, `SelectTrigger`, `Checkbox`), for accessibility.
- `<FieldError errors={[fieldState.error]} />` renders conditionally.
- **Select**: use `value={field.value}` + `onValueChange={field.onChange}` on `<Select>` — do NOT spread `field` onto `Select` (it's a non-native control).
- **Switch**: `checked={field.value}` + `onCheckedChange={field.onChange}`.
- **Checkbox arrays**: manage arrays manually — `field.onChange(checked ? [...field.value, id] : field.value.filter(v => v !== id))`.
- **`useFieldArray`** for repeating fields; key by `field.id`, name with `emails.${index}.address`.

## Anti-patterns to avoid (anti-AI-slop)

- **Inventing variants.** Using `<Button variant="primary">` — there is no `primary`; it's `default`. Stick to documented variants: `default | secondary | destructive | outline | ghost | link`.
- **Hard-coding colors in components.** Writing `className="bg-zinc-900 text-white"` instead of `bg-primary text-primary-foreground`. Breaks theming + dark mode. Always use tokens.
- **Spreading `field` onto non-native controls.** `<Select {...field}>` corrupts value handling. Use `value`/`onValueChange` (Select), `checked`/`onCheckedChange` (Switch/Checkbox).
- **Missing `DialogTitle`/`SheetTitle`.** Radix/Base UI warn and a11y degrades; provide one even if visually hidden (`sr-only`).
- **Using `<Button render={<a/>}/>`.** Base UI forces `role="button"`. Use `buttonVariants({ variant })` on a real `<a>`.
- **Re-implementing focus trap / outside-click / keyboard nav** on overlays. The primitives already do this. Don't wrap `Dialog` in your own keydown/escape handler.
- **Black-boxing the Data Table.** There is no `<DataTable data={...} />` drop-in from the registry — the doc is a recipe. Copy the columns + DataTable component, then adapt. Don't expect `shadcn add data-table` to exist (you `add table` + TanStack).
- **Over-nesting compound components.** `<Card><CardHeader><div><CardTitle/></div></CardHeader></Card>` — the extra `div` breaks the `--card-spacing` inset math. Put content directly in the sub-components.
- **Ignoring `data-icon` for icon spacing.** Bare icons in Buttons get inconsistent gaps; tag with `data-icon="inline-start"`/`"inline-end"`.
- **Editing `components/ui/*` to theme.** Theme via CSS variables in `globals.css`, not by editing source classes. Only edit source to add a genuinely new variant/size.
- **Forgetting the loading state.** Destructive/primary actions that async should `disabled` + show `<Spinner data-icon="inline-start" />`, not just text change.
- **Using Dialog where Sheet/Drawer fit better.** Centered modal for a long settings form = poor UX. Use Sheet (side) or Drawer (bottom, mobile).

## Quick decision matrix

| Need | Reach for |
|---|---|
| Trigger one action | `Button` (pick variant by emphasis) |
| Grouped static content | `Card` + sub-parts |
| Confirmation / short modal form | `Dialog` |
| Side panel / nav / filters | `Sheet` (side) |
| Mobile bottom sheet | `Drawer` |
| Hover preview (no focus steal) | `Hover Card` |
| Non-modal positioned menu | `Popover` |
| ⌘K palette / searchable actions | `Command` (or `CommandDialog`) |
| Searchable select | `Combobox` (Command inside Popover) |
| Native form select | `Native Select` / `Select` |
| Data grid with sort/filter/paginate | TanStack Table + `<Table>` (recipe) |
| Validated form | `<Field>` + `Controller` + zod + react-hook-form |
| Toggle boolean | `Switch` |
| Toggle multi-state / multi-select | `Toggle Group` |
| Tabbed sections | `Tabs` |
| Step/wizard | `Stepper`-style via Tabs or custom |

## References

- `references/component-catalog.md` — full per-component cheat sheet: anatomy trees, variant/size tables, props, and copy-paste snippets for all ~60 components (Accordion, Alert, Avatar, Badge, Breadcrumb, Calendar, Carousel, Chart, Checkbox, Collapsible, Combobox, Context Menu, Date Picker, Drawer, Dropdown Menu, Empty, Field, Hover Card, Input, Input OTP, Label, Menubar, Navigation Menu, Pagination, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Sidebar, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, Tooltip, Typography, plus the new chat-style Bubble/Message/Marker/Attachment/Message Scroller).

## Source

Distilled from ui.shadcn.com official docs (components index, Button, Card, Dialog, Sheet, Command, Data Table, Form/React Hook Form, Theming, CLI, Installation) as of 2026-08.