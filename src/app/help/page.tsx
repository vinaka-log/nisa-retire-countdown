import { redirect } from "next/navigation";

/** /help は FAQ・ヘルプと同一内容のため /faq へリダイレクト */
export default function HelpPage() {
  redirect("/faq");
}
