import countriesInEu from '@/static-data/countries-in-eu';

const SALES_TAX = process.env.NEXT_PUBLIC_SALES_TAX;
const SALES_TAX_EU = process.env.NEXT_PUBLIC_SALES_TAX_EU;
const SALES_TAX_EU_VAT = process.env.NEXT_PUBLIC_SALES_TAX_EU_VAT;
const SALES_TAX_DE = process.env.NEXT_PUBLIC_SALES_TAX_DE;
const GERMANY = 'Germany';

const calculateVat = (country, vatNo) => {
  let vat;
  if (country === GERMANY) {
    vat = SALES_TAX_DE;
  } else if (countriesInEu.includes(country)) {
    if (vatNo) {
      vat = SALES_TAX_EU_VAT;
    } else {
      vat = SALES_TAX_EU;
    }
  } else {
    vat = SALES_TAX;
  }
  return parseFloat(vat);
};

export default calculateVat;
