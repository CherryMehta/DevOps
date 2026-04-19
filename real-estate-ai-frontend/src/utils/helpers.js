/**
 * Utility functions
 */
export const formatPrice = (price) => {
  if (!price) return 'N/A'
  if (typeof price === 'string') return price
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatArea = (area) => {
  if (!area) return 'N/A'
  return `${area.toLocaleString()} sq.ft`
}

export const formatBHK = (bhk) => {
  if (!bhk) return 'N/A'
  return `${bhk} BHK`
}

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const truncate = (text, length = 100) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

export const getInitials = (name) => {
  return name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password) => {
  return password && password.length >= 6
}
