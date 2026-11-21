"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

/** Click-to-enlarge image using the native <dialog> element. */
export function ImageLightbox({
  src,
  alt,
  caption,
  sizes,
  className = "",
}: {
  src: StaticImageData;
  alt: string;
  caption: string;
  sizes: string;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className={`group relative block cursor-zoom-in overflow-hidden ${className}`}
        aria-label={`Enlarge: ${alt}`}
      >
        <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className="size-full object-cover" />
      </button>
      <dialog
        ref={ref}
        aria-label={caption}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto max-h-[94vh] w-[min(92vw,56rem)] bg-transparent p-0"
      >
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            sizes="(min-width: 900px) 800px, 92vw"
            placeholder="blur"
            className="mx-auto max-h-[88vh] w-auto object-contain"
          />
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="btn btn-primary absolute right-3 top-3 min-h-10 px-4"
          >
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
