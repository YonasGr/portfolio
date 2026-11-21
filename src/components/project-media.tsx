import Image from "next/image";
import type { Project } from "@/lib/content";
import { CoverArt } from "./cover-art";

/** Real screenshot when we have one, otherwise a generated woven cover. */
export function ProjectMedia({
  project,
  sizes,
  priority = false,
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
}) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.name} app screens`}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <>
      <CoverArt seed={project.id} className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      <span className="h-sub absolute bottom-0 left-0 bg-paper px-4 py-2 text-xl text-ink">{project.name}</span>
    </>
  );
}
