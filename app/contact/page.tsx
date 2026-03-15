/**
 * 联系方式页面
 * 路由：/contact
 * 数据流：联系表单 POST /api/contact
 * @module app/contact/page
 * @see docs/14-子页UI与首页统一方案.md
 */

import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientGlowBackground } from "@/components/effects/GradientGlowBackground";

export default function ContactPage() {
  return (
    <main className="relative container mx-auto px-4 py-12">
      <GradientGlowBackground />
      <div className="relative z-10">
        <PageHeader
          title="联系方式"
          subtitle="私密消息，通过表单发送仅我可见"
        />
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
