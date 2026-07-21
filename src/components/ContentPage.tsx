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
      <header className="content-page-header">
        <h1 className="content-page-title">{title}</h1>
        {description ? (
          <p className="content-page-description">{description}</p>
        ) : null}
      </header>
      <div className="content-page-body">{children}</div>
    </main>
  );
}

type ContentSectionProps = {
  title: string;
  children: ReactNode;
};

export function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <section className="content-section">
      <h2 className="content-section-title">{title}</h2>
      <div className="space-y-2.5 sm:space-y-3">{children}</div>
    </section>
  );
}
