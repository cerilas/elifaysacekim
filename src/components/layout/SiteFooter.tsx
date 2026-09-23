import React from 'react';
import { type Language, TRANSLATIONS } from '../../i18n';
import {
  FOOTER_I18N,
  getFooterFaqLinks,
  getFooterRegionLinks,
} from './footerLinks';

export interface SiteFooterProps {
  currentLang?: Language;
  onNavigate?: (to: string) => void;
  isSubpage?: boolean;
}

export function SiteFooter({
  currentLang = 'tr',
  onNavigate,
  isSubpage = false,
}: SiteFooterProps) {
  const lang = currentLang || 'tr';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.tr;
  const footer = FOOTER_I18N[lang] || FOOTER_I18N.tr;
  const faqLinks = getFooterFaqLinks(lang);
  const regionLinks = getFooterRegionLinks(lang);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(target);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="site-footer">
      {/* High-Conversion Specialist Banner */}
      <div className="footer-cta-banner">
        <div className="footer-cta-content">
          <p className="gallery-kicker" style={{ marginBottom: '8px' }}>
            {footer.kicker}
          </p>
          <h3>
            {footer.bannerTitleMain}
            <br />
            <em>{footer.bannerTitleEm}</em>
          </h3>
          <p>{footer.bannerDesc}</p>
        </div>
        <div className="footer-cta-actions">
          <a
            className="footer-whatsapp-cta"
            href={`https://wa.me/905364916040?text=${encodeURIComponent(footer.bannerWaMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/icons/whatsapp-icon.webp"
              alt="WhatsApp"
              width="24"
              height="24"
              style={{ display: 'block' }}
            />
            {footer.bannerWa}
          </a>
          <a className="footer-phone-cta" href="tel:+905364916040">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {footer.bannerPhone}
          </a>
        </div>
      </div>

      {/* Main Footer Layout */}
      <div className="footer-layout">
        <div className="footer-brand">
          <a
            className="wordmark"
            href={isSubpage ? '/' : '#top'}
            onClick={(e) => handleAnchor(e, isSubpage ? '/' : '#top')}
            aria-label="Elif Ay home"
          >
            <span className="brand-symbol" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            ELİF AY
          </a>
          <p className="footer-slogan">{footer.slogan}</p>
          <p className="footer-desc">{footer.desc}</p>
        </div>

        {/* Treatments Column */}
        <div className="footer-links">
          <h4>{footer.treatmentsTitle}</h4>
          <a
            href="/tedaviler/sac-ekimi"
            onClick={(e) => handleLinkClick(e, '/tedaviler/sac-ekimi')}
          >
            {footer.treatments.hair}
          </a>
          <a
            href="/tedaviler/kas-ekimi"
            onClick={(e) => handleLinkClick(e, '/tedaviler/kas-ekimi')}
          >
            {footer.treatments.eyebrow}
          </a>
          <a
            href="/tedaviler/sakal-ekimi"
            onClick={(e) => handleLinkClick(e, '/tedaviler/sakal-ekimi')}
          >
            {footer.treatments.beard}
          </a>
          <a
            href="/tedaviler/safir-fue-sac-ekimi"
            onClick={(e) => handleLinkClick(e, '/tedaviler/safir-fue-sac-ekimi')}
          >
            {footer.treatments.sapphire}
          </a>
          <a
            href="/tedaviler/dhi-sac-ekimi"
            onClick={(e) => handleLinkClick(e, '/tedaviler/dhi-sac-ekimi')}
          >
            {footer.treatments.dhi}
          </a>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links">
          <h4>{footer.quickLinksTitle}</h4>
          <a
            href={isSubpage ? '/#care' : '#care'}
            onClick={(e) => handleAnchor(e, isSubpage ? '/#care' : '#care')}
          >
            {footer.navPhilosophy}
          </a>
          <a
            href={isSubpage ? '/#specialist' : '#specialist'}
            onClick={(e) => handleAnchor(e, isSubpage ? '/#specialist' : '#specialist')}
          >
            {footer.navSpecialist}
          </a>
          <a
            href={isSubpage ? '/#treatments' : '#treatments'}
            onClick={(e) => handleAnchor(e, isSubpage ? '/#treatments' : '#treatments')}
          >
            {footer.navTreatments}
          </a>
          <a
            href={isSubpage ? '/#gallery' : '#gallery'}
            onClick={(e) => handleAnchor(e, isSubpage ? '/#gallery' : '#gallery')}
          >
            {footer.navGallery}
          </a>
          <a
            href={isSubpage ? '/#knowledge-base' : '#knowledge-base'}
            onClick={(e) => handleAnchor(e, isSubpage ? '/#knowledge-base' : '#knowledge-base')}
          >
            {footer.navKnowledge}
          </a>
          <a
            href={isSubpage ? '/#care' : '#care'}
            onClick={(e) => handleAnchor(e, isSubpage ? '/#care' : '#care')}
          >
            {footer.navContact}
          </a>
        </div>

        {/* Contact Column */}
        <div className="footer-contact">
          <h4>{footer.contactTitle}</h4>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {footer.location}
          </p>
          <p
            style={{
              fontSize: '0.82rem',
              opacity: 0.8,
              marginTop: '-6px',
              marginBottom: '8px',
              lineHeight: 1.4,
            }}
          >
            {footer.locationNote}
          </p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {footer.hours}
          </p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
            </svg>
            <a href="tel:+905364916040">0 536 491 60 40</a>
          </p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <a
              href="https://www.instagram.com/elifay.hairdentcoordination/"
              target="_blank"
              rel="noopener noreferrer"
            >
              elifay.hairdentcoordination
            </a>
          </p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <a href="mailto:elifcetin540@gmail.com">elifcetin540@gmail.com</a>
          </p>
        </div>
        
        {/* Map Column */}
        <div className="footer-map">
          <iframe 
            src="https://maps.google.com/maps?q=Sa%C3%A7+Ekim+Uzman%C4%B1+Elif+Ay+-+Gaziantep&t=&z=14&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '12px', display: 'block' }}
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Elif Ay Clinic Location"
          ></iframe>
        </div>
      </div>

      {/* SEO Links: FAQs & Regional Guides */}
      <div className="footer-seo">
        <div className="seo-block">
          <h4>{footer.faqTitle}</h4>
          <div className="seo-links">
            {faqLinks.map((item) => (
              <a
                key={item.slug}
                href={`/bilgi-bankasi/${item.slug}`}
                onClick={(e) => handleLinkClick(e, `/bilgi-bankasi/${item.slug}`)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="seo-block">
          <h4>{footer.regionsTitle}</h4>
          <div className="seo-links">
            {regionLinks.map((item) => (
              <a
                key={item.slug}
                href={`/bilgi-bankasi/${item.slug}`}
                onClick={(e) => handleLinkClick(e, `/bilgi-bankasi/${item.slug}`)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom / Copyright & Developer Credit */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Elif Ay Saç Ekim Koordinatörlüğü. {t.allRightsReserved}
          </p>
          <div className="footer-credit">
            <a
              href="https://www.cerilas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-cerilas-link"
              title="Cerilas"
            >
              {footer.developedBy}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
