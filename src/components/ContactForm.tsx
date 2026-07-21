"use client";

import { useState, type FormEvent } from "react";
import { SITE_NAME } from "@/lib/site";

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

    if (!hasEmail) {
      setStatus(
        "現在メールでのお問い合わせ受付を準備しています。しばらくしてから再度お試しください。",
      );
      return;
    }

    if (!message.trim()) {
      setStatus("お問い合わせ内容を入力してください。");
      return;
    }

    const mailSubject =
      subject.trim() || `${SITE_NAME}へのお問い合わせ`;
    const body = [
      `お名前: ${name.trim() || "（任意・未入力）"}`,
      `返信先メール: ${email.trim() || "（任意・未入力）"}`,
      "",
      message.trim(),
    ].join("\n");

    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus(
      "メールアプリが開きます。送信が完了しない場合は、表示のメールアドレスへ直接ご連絡ください。",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form space-y-4">
      {!hasEmail ? (
        <p className="contact-form-banner" role="status">
          現在メールでのお問い合わせ受付を準備しています。しばらくしてから再度お試しください。
        </p>
      ) : null}

      <label className="contact-form-field">
        <span>お名前（任意）</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          disabled={!hasEmail}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="contact-form-field">
        <span>返信先メールアドレス（任意）</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          disabled={!hasEmail}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="contact-form-field">
        <span>件名（任意）</span>
        <input
          type="text"
          name="subject"
          value={subject}
          disabled={!hasEmail}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>

      <label className="contact-form-field">
        <span>お問い合わせ内容</span>
        <textarea
          name="message"
          required={hasEmail}
          value={message}
          disabled={!hasEmail}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={!hasEmail}
        className="soft-affiliate-btn-primary contact-form-submit"
      >
        メールで送信する
      </button>

      {status ? (
        <p className="contact-form-status" role="status">
          {status}
        </p>
      ) : null}

      {hasEmail ? (
        <p className="contact-form-hint">
          送信ボタンを押すと、ご利用端末のメールアプリが開きます。サーバーへの直接送信は行いません。
        </p>
      ) : null}
    </form>
  );
}
