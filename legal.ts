/**
 * Details shown on /privacy and /terms.
 * Set these in the hosting environment (Vercel → Settings → Environment Variables):
 *   OPERATOR_NAME     – your name or the name of your business
 *   OPERATOR_COUNTRY  – country whose law applies (e.g. Poland)
 *   CONTACT_EMAIL     – where people can reach you about privacy or the terms
 */
export const legal = {
  operatorName:
    process.env.OPERATOR_NAME?.trim() || "[operator name – set OPERATOR_NAME]",
  operatorCountry:
    process.env.OPERATOR_COUNTRY?.trim() || "[country – set OPERATOR_COUNTRY]",
  contactEmail: process.env.CONTACT_EMAIL?.trim() || "",
};

export const LEGAL_EFFECTIVE = "24 October 2026";
export const LEGAL_UPDATED = "24 October 2026";
