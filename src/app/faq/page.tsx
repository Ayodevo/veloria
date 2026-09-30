import React from "react";
import { getSiteSettings, parseTranslatable } from "@/lib/settings";
import { db } from "@/db";
import { PublicPageWrapper } from "@/components/PublicPageWrapper";

export const revalidate = 60;

export default async function FaqPage() {
  const settings = await getSiteSettings();

  const faqCategories = await db.query.faqCategories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });

  const faqs = await db.query.faqs.findMany({
    where: (f, { eq }) => eq(f.isPublished, true),
    orderBy: (f, { asc }) => [asc(f.sortOrder)],
  });

  return (
    <PublicPageWrapper settings={settings}>
      <div className="py-12 bg-gradient-to-b from-[var(--color-powder-pink)]/20 to-[var(--color-ivory)] min-h-[80vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
              Centre d'aide & Questions
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-rose-brown)]">
              Foire Aux Questions
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-rose-brown)]/80 max-w-md mx-auto">
              Retrouve toutes les réponses concernant nos sessions de transport d'Allemagne, les frais de service Shein Concierge et la livraison en Tunisie.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => {
              const question = parseTranslatable(faq.question);
              const answer = parseTranslatable(faq.answer);

              return (
                <div
                  key={faq.id}
                  className="bg-white p-6 rounded-3xl border border-[var(--color-powder-pink)] shadow-xs space-y-3"
                >
                  <h3 className="font-serif text-lg font-bold text-[var(--color-rose-brown)]">
                    {question}
                  </h3>
                  <p className="text-xs text-[var(--color-rose-brown)]/80 leading-relaxed font-light">
                    {answer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PublicPageWrapper>
  );
}
