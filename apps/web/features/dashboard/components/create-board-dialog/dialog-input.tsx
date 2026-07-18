"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";

import { useAuth } from "@/features/auth/store/selectors";
import { createBoard } from "@/features/board/api/board-api";
import { useSetBoards } from "@/features/board/store/selectors";
import { useSetPages } from "@/features/page/store/selectors";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Board name is required.")
    .max(80, "Board name cannot exceed 80 characters."),
  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters."),
  isPublic: z.boolean(),
  favorite: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DialogInput() {
  const auth = useAuth();
  const setBoards = useSetBoards();
  const setPages = useSetPages();

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
      favorite: false,
    },
  });

  async function handleSubmit(values: FormValues) {
    if (!auth.user) return;

    const { board } = await createBoard({
      ...values,
      ownerId: auth.user.id,
      thumbnail: null,
    });

    const firstPage = board.pages[0]!;
    router.push(`/board/${board.id}/${firstPage.id}`);
  }

  return (
    <form
      id="create-board-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6"
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Board Name</FieldLabel>

              <Input
                {...field}
                autoFocus
                maxLength={80}
                placeholder="Untitled board"
                aria-invalid={fieldState.invalid}
              />

              <div className="flex items-center justify-between">
                <FieldDescription>
                  Give your board a meaningful name.
                </FieldDescription>

                <InputGroupText className="tabular-nums">
                  {field.value.length}/80
                </InputGroupText>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>

              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  rows={4}
                  className="resize-none"
                  placeholder="Optional description..."
                  aria-invalid={fieldState.invalid}
                />

                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value!.length}/300
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              <FieldDescription>
                Help collaborators understand the purpose of this board.
              </FieldDescription>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isPublic"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <div className="space-y-1">
                <FieldLabel>Public Board</FieldLabel>

                <FieldDescription>
                  Anyone with the link can access this board.
                </FieldDescription>
              </div>

              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </Field>
          )}
        />

        <Controller
          name="favorite"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <div className="space-y-1">
                <FieldLabel>Favorite</FieldLabel>

                <FieldDescription>
                  Pin this board to the top of your dashboard.
                </FieldDescription>
              </div>

              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>

        <Button type="submit">Create Board</Button>
      </div>
    </form>
  );
}
