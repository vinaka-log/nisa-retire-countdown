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
        <p className="home-seo-links">
          <Link href="/guides" className="text-emerald-700 hover:underline">
            老後資金・シミュレーションのガイド
          </Link>
          {" · "}
          <Link href="/faq" className="text-emerald-700 hover:underline">
            FAQ・ヘルプ
          </Link>
        </p>
      </section>
    </RetireSimulator>
  );
}
