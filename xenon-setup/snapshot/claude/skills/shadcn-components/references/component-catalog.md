# shadcn/ui Component Catalog (reference)

Full cheat sheet for every shadcn/ui component: anatomy, variants/sizes, key props, and the smallest useful snippet. Use alongside `SKILL.md`. Tokens and install/CLI are documented there.

Install any single component with `pnpm dlx shadcn@latest add <name>` (swap `pnpm dlx` for `npx`/`yarn dlx`/`bunx` as needed).

---

## Accordion
Vertically stacked expandable sections.
```
Accordion
├── AccordionItem (value)
│   ├── AccordionTrigger
│   └── AccordionContent
```
Props: `type="single"|"multiple"`, `collapsible` (single), `defaultValue`. ARIA variant available.
```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Alert
Inline contextual feedback (not a toast).
```
Alert (variant: default | destructive)
├── AlertTitle
└── AlertDescription
```
Use for static in-page messages; use `Toast` for transient.

## Alert Dialog
Confirmation dialog for destructive/important actions — more forceful than Dialog (no easy dismiss).
```
AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader (AlertDialogTitle, AlertDialogDescription)
    └── AlertDialogFooter (AlertDialogAction, AlertDialogCancel)
```
`AlertDialogAction` performs the action; `AlertDialogCancel` closes. Always wire both.

## Aspect Ratio
`<AspectRatio ratio={16/9}>` constrains a child to a ratio. Use for media.

## Attachment *(new)*
File attachment chip for chat/message UIs.

## Avatar
```
Avatar
├── AvatarImage (src)
└── AvatarFallback
```

## Badge
Small status/label.
Variants: `default | secondary | destructive | outline`. Optional dot/status variants.

## Breadcrumb
```
Breadcrumb
├── BreadcrumbList
│   ├── BreadcrumbItem > BreadcrumbLink / BreadcrumbPage
│   └── BreadcrumbSeparator
```
Last item is `BreadcrumbPage` (non-link).

## Bubble *(new)*
Chat bubble container (left/right alignment via `variant`).

## Button Group
Group multiple `Button`s with shared border treatment. `ButtonGroup` wraps children; per-button `variant` still applies.

## Calendar
Date picker surface (built on `react-day-picker`). Pair with `Popover` for a Date Picker.

## Card — see SKILL.md
Compound: `Card / CardHeader (CardTitle, CardDescription, CardAction) / CardContent / CardFooter`. `size="default"|"sm"`. `--card-spacing` CSS var.

## Carousel
Embla-based carousel.
```
Carousel
├── CarouselContent > CarouselItem
├── CarouselPrevious
└── CarouselNext
```
Props: `orientation`, `opts` (Embla options), `setApi`.

## Chart
Thin wrapper over Recharts with token-driven colors (`chart-1..chart-5`). Use `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`.

## Checkbox
`<Checkbox checked onCheckedChange />`. Indeterminate via `checked="indeterminate"`. For arrays, manage manually (see Form rules in SKILL.md).

## Collapsible
```
Collapsible
├── CollapsibleTrigger
└── CollapsibleContent
```

## Combobox
Not a standalone component — a **pattern**: `Command` inside `Popover`. Set `shouldFilter` on Command to control filtering (e.g. async search). Use `<PopoverTrigger asChild><Button/></PopoverTrigger>`.

## Command — see SKILL.md
`Command / CommandInput / CommandList / CommandEmpty / CommandGroup / CommandItem / CommandSeparator / CommandShortcut`. `CommandDialog` for ⌘K overlay. Built on `cmdk`.

## Context Menu
Right-click menu.
```
ContextMenu
├── ContextMenuTrigger
└── ContextMenuContent
    ├── ContextMenuItem / ContextMenuCheckboxItem / ContextMenuRadioItem
    ├── ContextMenuSub > ContextMenuSubContent
    └── ContextMenuSeparator
```

## Data Table — see SKILL.md (recipe, not a drop-in)
TanStack Table + `<Table>`. Wire sorting/filter/pagination/visibility/selection state into `useReactTable`.

## Date Picker
Pattern: `Popover` + `Calendar` (+ optional `DateRange` using `mode="range"`).

## Dialog — see SKILL.md
`Dialog / DialogTrigger / DialogContent / DialogHeader(DialogTitle, DialogDescription) / DialogFooter / DialogClose`. `showCloseButton`. Sticky footer + scrollable body supported.

## Direction
Provider to set reading direction (`ltr`/`rtl`) for descendant components.

## Drawer
Bottom sheet (vaul). Mobile-first, drag-to-dismiss.
```
Drawer
├── DrawerTrigger
└── DrawerContent
    ├── DrawerHeader (DrawerTitle, DrawerDescription)
    └── DrawerFooter
```

## Dropdown Menu
Most common action menu.
```
DropdownMenu
├── DropdownMenuTrigger (asChild)
└── DropdownMenuContent (align: start|center|end", sideOffset)
    ├── DropdownMenuLabel
    ├── DropdownMenuItem
    ├── DropdownMenuCheckboxItem (checked, onCheckedChange)
    ├── DropdownMenuRadioGroup + DropdownMenuRadioItem
    ├── DropdownMenuSub > DropdownMenuSubTrigger / DropdownMenuSubContent
    ├── DropdownMenuSeparator
    └── DropdownMenuShortcut
```
`DropdownMenuItem` supports `variant="destructive"`. Use `<DropdownMenuCheckboxItem>` for column-visibility toggles in DataTable.

## Empty
Empty-state container (icon + title + description + action).

## Field — see SKILL.md (Form)
`Field / FieldLabel / FieldDescription / FieldError / FieldGroup`. `data-invalid` on `Field`, `aria-invalid` on the control, `FieldError errors={[error]}`.

## Hover Card
Preview on hover; non-modal, no focus trap.
```
HoverCard > HoverCardTrigger (asChild) > HoverCardContent (side, align, sideOffset)
```

## Input
`<Input type="..." />`. For currency/numeric formatting use the formatting pattern shown in DataTable column cells.

## Input Group
Composes prefix/suffix adornments around an Input (icon, button, inline code).

## Input OTP
`InputOTP / InputOTPGroup / InputOTPSlot`. `maxLength` per slot group.

## Item
Generic list item primitive (label + description + shortcut), used inside menus/commands.

## Kbd
Keyboard keycap display: `<Kbd>⌘</Kbd>`.

## Label
`<Label htmlFor="id" />`. Prefer `FieldLabel` inside forms.

## Marker *(new)*
Chat avatar/marker bubble.

## Menubar
Horizontal menu bar (OS-style): `Menubar > MenubarMenu > MenubarTrigger > MenubarContent ...`.

## Message *(new)*
Chat message container; pairs with `Bubble`, `Message Scroller`.

## Message Scroller *(new)*
Auto-scroll container for chat message lists.

## Native Select
Plain `<select>` styled — for cases where Radix `Select` (popup) is overkill or SSR-sensitive.

## Navigation Menu
```
NavigationMenu
├── NavigationMenuList > NavigationMenuItem > NavigationMenuTrigger > NavigationMenuContent
└── NavigationMenuLink / NavigationMenuIndicator / NavigationMenuViewport
```

## Pagination
`Pagination / PaginationContent / PaginationItem / PaginationLink / PaginationPrevious / PaginationNext / PaginationEllipsis`. `isActive` on `PaginationLink`.

## Popover
Non-modal floating panel anchored to a trigger.
```
Popover > PopoverTrigger (asChild) > PopoverContent (align, side, sideOffset)
```

## Progress
`<Progress value={66} />` (0–100, or `max`). Indeterminate supported.

## Radio Group
`RadioGroup / RadioGroupItem`. `value`/`onValueChange` on group; `id`+`<Label>` per item.

## Resizable
`ResizablePanelGroup (direction) > ResizablePanel + ResizableHandle (withHandle)`. Persist sizes with `autoSaveId`.

## Scroll Area
`ScrollArea / ScrollBar (orientation)`. Custom-styled scrollbars; `type="always"|"hover"|"scroll"`.

## Select (Radix)
```
Select
├── SelectTrigger (asChild) > SelectValue (placeholder)
└── SelectContent
    ├── SelectGroup > SelectItem (value)
    ├── SelectLabel
    └── SelectSeparator
```
Controlled: `value` + `onValueChange`. **Do not spread `field` onto Select** — use those two props.

## Separator
`<Separator orientation="horizontal|vertical" />`.

## Sheet — see SKILL.md
`Sheet / SheetTrigger / SheetContent (side: top|right|bottom|left, showCloseButton) / SheetHeader (SheetTitle, SheetDescription) / SheetFooter / SheetClose`.

## Sidebar
Compound: `SidebarProvider > Sidebar (side, variant, collapsible) + SidebarInset`. Sub-parts: `SidebarHeader/Content/Footer`, `SidebarGroup/GroupLabel/GroupContent/GroupAction`, `SidebarMenu/MenuItem/MenuButton/MenuAction/Sub`, `SidebarTrigger`, `SidebarRail`, `SidebarSeparator`, `SidebarInput`. Dedicated `sidebar-*` token set. Collapsible modes: `offcanvas|icon|none`. `useSidebar()` hook.

## Skeleton
`<Skeleton className="h-12 w-12 rounded-full" />`. Pulse placeholder while loading.

## Slider
`<Slider value={[min,max]} onValueChange max min step />`. Multi-thumb via array values.

## Spinner
Loading spinner. Tag with `data-icon="inline-start"` when inside a Button.

## Switch
`<Switch checked onCheckedChange />`. For forms use `checked={field.value}` + `onCheckedChange={field.onChange}`.

## Table
```
Table
├── TableHeader > TableRow > TableHead
└── TableBody > TableRow > TableCell
├── TableCaption
└── TableFooter > TableRow > TableCell
```
Foundation for Data Table. `flexRender` for header/cell content.

## Tabs
```
Tabs (value, onValueChange)
├── TabsList
│   ├── TabsTrigger (value)
│   └── TabsTrigger
└── TabsContent (value)
```
`orientation`, `activationMode="automatic"|"manual"`.

## Textarea
`<Textarea />`. Auto-resize via a wrapper or `field` spread in forms.

## Toast *(new)*
```
Toaster (mount once)
Toast / ToastTitle / ToastDescription / ToastAction / ToastClose / ToastProvider
```
`useToast()` or direct `toast()` API (depends on version). `variant="default"|"destructive"|"success"`.

## Toggle
`<Toggle variant="default|outline" size="default|sm|lg" pressed onPressedChange />`.

## Toggle Group
`ToggleGroup (type: single|multiple, value, onValueChange) > ToggleGroupItem (value)`.

## Tooltip
```
TooltipProvider > Tooltip > TooltipTrigger (asChild) > TooltipContent (side, align)
```
Must wrap app (or subtree) in `TooltipProvider` (or `Tooltip` self-provides in newer versions). Keep tooltip content short.

## Typography
Helper text styles: `TypographyLarge/Medium/Small/Muted/Lead/List/InlineCode/Blockquote/Table`. Apply instead of ad-hoc `text-*` utilities for consistent type scale.