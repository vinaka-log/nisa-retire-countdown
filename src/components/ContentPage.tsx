import type { ReactNode } from "react";

type ContentPageProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

/** Shared shell for legal / help content pages. */
export function ContentPage({ title, description, children }: ContentPageProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </header>
      <div className="space-y-8 text-sm leading-relaxed text-zinc-700 sm:text-base">
        {children}
      </div>
    </main>
  );
}

type ContentSectionProps = {
  title: string;
  children: ReactNode;
};

export function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      {children}
    </section>
  );
}
