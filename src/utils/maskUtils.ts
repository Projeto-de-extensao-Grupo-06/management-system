export function formatPhone(value: string | undefined): string {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 11) return value;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
}

export function formatDocument(value: string | undefined, docType: 'CPF' | 'CNPJ'): string {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    
    if (docType === 'CNPJ') {
        if (cleaned.length !== 14) return value;
        return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
    }
    
    if (cleaned.length !== 11) return value;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
}

export function formatCep(value: string | undefined): string {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 8) return value;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
}

export function unformatValue(value: string | undefined): string {
    if (!value) return '';
    return value.replace(/\D/g, '');
}

export function formatCurrencyBR(value: string | number) {
  if (!value) return "";

  const stringValue = String(value).replace(/^0+/, '') || '0';
  
  const cleaned = stringValue.replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  
  if (isNaN(num)) return "";
  
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercentageBR(value: string | number) {
  if (!value) return "";
  
  const stringValue = String(value).replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(stringValue);
  
  if (isNaN(num)) return "";
  
  return (num / 100).toLocaleString("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrencyToNumber(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export function parsePercentageToNumber(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}