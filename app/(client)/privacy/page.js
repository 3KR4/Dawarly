"use client";

import useTranslate from "@/Contexts/useTranslation";
import "@/styles/client/pages/privacy.css";

export default function PrivacyPolicy() {
  const t = useTranslate();

  return (
    <div className="legal-document container">
      {t.legal.sections.map((section) => (
        <div className="document-section" key={section.title}>
          <h1>{section.title}</h1>
          <div className="metadata">
            <p>
              <strong>{t.legal.metadata.effectiveDate}:</strong>{" "}
              {t.legal.metadata.pendingDate}
            </p>
            <p>
              <strong>{t.legal.metadata.lastUpdated}:</strong>{" "}
              {t.legal.metadata.pendingDate}
            </p>
          </div>

          {section.blocks.map((block) => (
            <section key={block.heading}>
              <h2>{block.heading}</h2>

              {block.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {block.list && (
                <ul>
                  {block.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      ))}
    </div>
  );
}
