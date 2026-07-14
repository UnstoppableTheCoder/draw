export default function DialogContent() {
  return (
    <>
      <p className="mt-2 text-sm text-muted-foreground">
        Start blank or use a template with your team.
      </p>

      <label htmlFor="board-name" className="mt-5 block text-xs font-medium">
        Board name
      </label>

      <input
        id="board-name"
        autoFocus
        placeholder="Untitled board"
        className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </>
  );
}
