export const formatCurrency = (value: number | string): string => {
  const num = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(num)) return ''
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    maximumFractionDigits: 0,
  }).format(num)
}

export const CURRENCY_CODE = 'PYG'
