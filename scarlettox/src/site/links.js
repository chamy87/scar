// All giving CTAs send visitors to Cook Children's Health Foundation directly —
// no amounts or payment details are collected on this site.
export const DONATE_URL = 'https://foundation.cookchildrens.org/site/Donation2?4020.donation=form1&df_id=4020&mfc_pref=T&utm_source=website&utm_medium=banner&utm_campaign=foundation-website';

// Every medical or statistical claim on the site links to one of these sources.
export const SOURCES = {
  hopkins: {
    label: 'Johns Hopkins Medicine',
    url: 'https://www.hopkinsmedicine.org/health/conditions-and-diseases/tetralogy-of-fallot-tof',
    note: 'Tetralogy of Fallot — prevalence (1 in 2,518 U.S. births), the four defects, and repair timing.',
  },
  cdcTof: {
    label: 'CDC — Tetralogy of Fallot',
    url: 'https://www.cdc.gov/heart-defects/about/tetralogy-of-fallot.html',
    note: 'What TOF is, symptoms, causes, and treatment.',
  },
  cdcData: {
    label: 'CDC — Congenital heart defect data',
    url: 'https://www.cdc.gov/heart-defects/data/index.html',
    note: 'CHDs affect about 1 in 100 U.S. births (~40,000 babies each year); about 1 in 4 are critical.',
  },
  childrensNational: {
    label: "Children's National Hospital",
    url: 'https://www.childrensnational.org/get-care/departments/cardiac-surgery/outcomes-data/long-term-outcomes/tetralogy-of-fallot',
    note: 'Long-term outcomes after TOF repair — an estimated 95% survival at 10 years.',
  },
  aha: {
    label: 'American Heart Association',
    url: 'https://www.heart.org/en/health-topics/congenital-heart-defects/about-congenital-heart-defects/tetralogy-of-fallot',
    note: 'Life after repair — activity, lifelong cardiology follow-up, and later pulmonary valve replacement.',
  },
  mayo: {
    label: 'Mayo Clinic',
    url: 'https://www.mayoclinic.org/diseases-conditions/tetralogy-of-fallot/symptoms-causes/syc-20353477',
    note: 'Symptoms (cyanosis, murmur, tiring easily) and causes.',
  },
  foundation: {
    label: "Cook Children's Health Foundation",
    url: 'https://foundation.cookchildrens.org/',
    note: 'The 501(c)(3) nonprofit that receives every donation made through this site.',
  },
  giftImpact: {
    label: "Cook Children's giving levels",
    url: 'https://www.cookchildrenspromise.org/ways-to-give/monthly/',
    note: 'What gifts provide: $12 a PrayerBear, $45 a month of food for a facility dog, $75 a medical center meal card.',
  },
};
