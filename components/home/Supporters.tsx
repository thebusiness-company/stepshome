'use client';

export default function Supporters() {
  const supporters = [
    { name: 'TechCorp', logo: 'TC' },
    { name: 'Global Foundation', logo: 'GF' },
    { name: 'Care Trust', logo: 'CT' },
    { name: 'Hope Initiative', logo: 'HI' },
    { name: 'Future Builders', logo: 'FB' },
    { name: 'EduFund', logo: 'EF' },
  ];

  return (
    <section className="py-20 bg-brand-bg border-y border-brand-primary/10 overflow-hidden" aria-label="Our supporters">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h2 className="text-3xl font-serif font-bold text-brand-dark">The People Behind Us</h2>
        {/* <p className="text-brand-muted mt-2">Grateful for our partners and sponsors</p> */}
      </div>

      <div className="flex gap-8 px-4 animate-[scroll_30s_linear_infinite] w-max">
        {[...supporters, ...supporters, ...supporters].map((supporter, i) => (
          <div
            key={i}
            className="w-48 h-24 bg-white rounded-2xl shadow-glass flex items-center justify-center shrink-0 border border-brand-primary/5 hover:border-brand-primary/30 transition-colors"
          >
            <span className="text-2xl font-bold text-brand-muted/50">{supporter.logo}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}
