export const SITE = {
  mentorName: "Наталія",
  brand: "Cosmic Royal",
  tagline: "Незалежна партнерка GaliantPro",
  trialUrl: process.env.NEXT_PUBLIC_TRIAL_URL || "https://winwinpro.customer.smartsender.eu/lp/spKmw9bA?ref=248654060",
  telegramUrl: process.env.NEXT_PUBLIC_MENTOR_TELEGRAM || "",
  instagramUrl: process.env.NEXT_PUBLIC_MENTOR_INSTAGRAM || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const formatUAH = (n: number) => `${n.toLocaleString("uk-UA").replace(/,/g, " ")} грн`;
