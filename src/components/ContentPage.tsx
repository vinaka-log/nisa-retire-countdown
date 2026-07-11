import type { ReactNode } from "react";

type ContentPageProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

/** Shared shell for legal / help content pages. */
export function ContentPage({ title, description, children }: ContentPageProps) {
  return (
    <main className="content-page mx-auto w-full max-w-3xl flex-1 px-5 pt-9 pb-10 sm:px-6 sm:pt-10 sm:pb-12">
      <header className="mb-7 border-b border-zinc-200/70 pb-5 sm:mb-8 sm:pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:mt-3 sm:text-base">
            {description}
          </p>
        ) : null}
      </header>
      <div className="space-y-7 text-sm leading-relaxed text-zinc-700 sm:space-y-8 sm:text-base">
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
    <section className="content-section space-y-2.5 sm:space-y-3">
      <h2 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">
        {title}
      </h2>
      {children}
    </section>
  );
}
