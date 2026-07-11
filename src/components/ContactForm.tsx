"use client";

import { useState, type FormEvent } from "react";
import { getGithubNewIssueUrl } from "@/lib/site-config";

type ContactFormProps = {
  contactEmail: string;
};

export function ContactForm({ contactEmail }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const hasEmail = contactEmail.length > 0 && contactEmail.includes("@");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!message.trim()) {
      setStatus("お問い合わせ内容を入力してください。");
      return;
    }

    const mailSubject =
      subject.trim() || "つみたてNISAシミュレーターへのお問い合わせ";
    const body = [
      `お名前: ${name.trim() || "（任意・未入力）"}`,
      `返信先メール: ${email.trim() || "（任意・未入力）"}`,
      "",
      message.trim(),
    ].join("\n");

    if (hasEmail) {
      const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setStatus(
        "メールアプリが開きます。送信が完了しない場合は、表示のメールアドレスへ直接ご連絡ください。",
      );
      return;
    }

    const issueUrl = getGithubNewIssueUrl({
      title: mailSubject,
      body,
    });
    window.open(issueUrl, "_blank", "noopener,noreferrer");
    setStatus(
      "GitHub Issues の新規作成画面を開きました。内容を確認のうえ「Submit new issue」で投稿してください。",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5"
    >
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-800">お名前（任意）</span>
        <input
          className="rounded-lg border border-zinc-300 px-3 py-2"
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-800">
          返信先メールアドレス（任意）
        </span>
        <input
          className="rounded-lg border border-zinc-300 px-3 py-2"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-800">件名（任意）</span>
        <input
          className="rounded-lg border border-zinc-300 px-3 py-2"
          type="text"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-zinc-800">お問い合わせ内容</span>
        <textarea
          className="min-h-32 rounded-lg border border-zinc-300 px-3 py-2"
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
      >
        {hasEmail ? "メールで送信する" : "問い合わせを送信する"}
      </button>

      {status ? (
        <p className="text-sm leading-relaxed text-zinc-600" role="status">
          {status}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-zinc-500">
        {hasEmail
          ? "送信ボタンを押すと、ご利用端末のメールアプリが開きます。サーバーへの直接送信は行いません。"
          : "送信ボタンを押すと GitHub Issues の新規作成画面が開きます。投稿には GitHub アカウントが必要です。"}
      </p>
    </form>
  );
}
