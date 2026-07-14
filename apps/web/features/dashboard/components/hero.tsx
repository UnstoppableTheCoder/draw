import Avatar from "./avatar";

export function Hero() {
  return (
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm text-muted-foreground">Tuesday, July 14</p>

        <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight">
          Good morning, Riley
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Pick up where your team left off or start something new.
        </p>
      </div>

      <div className="flex -space-x-2">
        <Avatar>MN</Avatar>
        <Avatar>JK</Avatar>
        <Avatar>AL</Avatar>

        <div className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary text-[9px] font-bold">
          +5
        </div>
      </div>
    </section>
  );
}
