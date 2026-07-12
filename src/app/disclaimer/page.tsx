import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/ContentPage";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "免責事項",
  description: `${SITE_NAME}のシミュレーション・投資情報・アフィリエイトに関する免責事項です。`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <ContentPage
      title="免責事項"
      description={`${SITE_NAME}（以下「当サイト」）をご利用いただく際の注意事項・免責事項です。`}
    >
      <ContentSection title="1. 投資助言ではありません">
        <p>
          当サイトが提供する情報・シミュレーション結果は、一般的な情報提供および学習・検討の補助を目的としたものであり、金融商品取引法その他の法令に基づく投資助言、投資勧誘、または特定の金融商品の推奨を行うものではありません。
        </p>
      </ContentSection>

      <ContentSection title="2. シミュレーションは概算です">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            表示される年数・資産額・進捗・取り崩し額等は、利用者が入力した条件に基づく簡易計算の結果です。
          </li>
          <li>
            実際の運用では、相場変動・手数料・税金・入出金・制度変更・為替等により結果が大きく異なる場合があります。
          </li>
          <li>
            「4%ルール」等の取り崩しに関する表示は、一般に言及される仮定の一例であり、生活の持続可能性や運用成績を保証するものではありません。
          </li>
          <li>将来の運用成果を約束・保証するものではありません。</li>
        </ul>
      </ContentSection>

      <ContentSection title="3. 利用者ご自身の判断と責任">
        <p>
          投資・積立・口座開設・金融商品の選択・契約等に関する最終的な判断は、利用者ご自身の責任において行ってください。必要に応じて、信頼できる専門家や各金融機関の公式情報をご確認ください。
        </p>
      </ContentSection>

      <ContentSection title="4. アフィリエイト広告について">
        <p>
          当サイトには、アフィリエイト広告（第三者の商品・サービスの紹介リンク）が含まれる場合があります。現時点で表示されていない場合でも、今後掲載することがあります。
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            リンク経由で申し込み等が行われた場合、運営者が当該事業者から報酬を受け取ることがあります。
          </li>
          <li>
            紹介しているサービス内容・条件は変更されることがあり、最新情報は各事業者の公式サイトでご確認ください。
          </li>
          <li>
            リンク先での取引・契約に関して生じた損害について、当サイトは責任を負いません。
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="5. 外部サイト・コンテンツ">
        <p>
          当サイトからリンクする外部サイトの内容・安全性・プライバシー管理について、当サイトは保証しません。また、当サイトの情報の正確性・完全性・有用性について、万全を期しますが保証するものではありません。
        </p>
      </ContentSection>

      <ContentSection title="6. 損害等について">
        <p>
          当サイトの利用、情報の閲覧、シミュレーション結果の利用、リンク先サービスの利用等によって生じた損害（直接・間接を問わず）について、運営者に故意または重過失がある場合を除き、責任を負いません。
        </p>
      </ContentSection>

      <ContentSection title="7. 関連ページ">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <Link href="/terms" className="text-emerald-700 hover:underline">
              利用規約
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="text-emerald-700 hover:underline">
              プライバシーポリシー
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-emerald-700 hover:underline">
              FAQ・ヘルプ
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-emerald-700 hover:underline">
              お問い合わせ
            </Link>
          </li>
        </ul>
      </ContentSection>

      <p className="text-xs text-zinc-500">制定日: 2026年7月11日</p>
    </ContentPage>
  );
}
