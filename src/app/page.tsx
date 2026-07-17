import Link from "next/link";
import { RetireSimulator } from "@/components/RetireSimulator";
import { SITE_NAME } from "@/lib/site";

export default function HomePage() {
  return (
    <RetireSimulator>
      <section
        className="home-block home-seo"
        aria-labelledby="home-seo-heading"
      >
        <h2 id="home-seo-heading" className="home-section-title">
          {SITE_NAME}について
        </h2>
        <p className="home-section-lead">
          {SITE_NAME}
          は、つみたてNISAなどの積立・想定利回り・目標資産から、引退までのギャップを見える化する無料シミュレーターです。会員登録は不要で、入力はブラウザ上で計算に使います。表示は概算であり、投資助言ではありません。
        </p>
        <p className="home-section-lead">
          使い方のヒントはガイドにまとめています。目標の置き方、結果の読み方、取り崩しの目安からどうぞ。
        </p>
        <ul className="home-seo-links list-disc space-y-1 pl-5">
          <li>
            <Link
              href="/guides/retirement-funds"
              className="text-emerald-700 hover:underline"
            >
              老後資金はいくら必要？目安の考え方
            </Link>
          </li>
          <li>
            <Link
              href="/guides/nisa-simulation"
              className="text-emerald-700 hover:underline"
            >
              つみたてNISAシミュレーションの見方
            </Link>
          </li>
          <li>
            <Link
              href="/guides/4-percent-rule"
              className="text-emerald-700 hover:underline"
            >
              4%ルールと取り崩しシミュレーション
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-emerald-700 hover:underline">
              FAQ・ヘルプ
            </Link>
          </li>
        </ul>
      </section>
    </RetireSimulator>
  );
}
