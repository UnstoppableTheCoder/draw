"use client";

import TemplatesHeader from "./header";
import TemplateCard from "./card";
import { TEMPLATES } from "../../data";

export default function Templates({
  onCreateBoard,
}: {
  onCreateBoard: () => void;
}) {
  return (
    <section>
      <TemplatesHeader />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onClick={onCreateBoard}
          />
        ))}
      </div>
    </section>
  );
}
