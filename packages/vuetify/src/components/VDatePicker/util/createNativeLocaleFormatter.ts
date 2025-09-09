import pad from './pad'
import { DatePickerFormatter } from 'vuetify/types'

interface SubstrOptions {
  start?: number
  length: number
}

function createNativeLocaleFormatter (
  local: string | undefined,
  options: Intl.DateTimeFormatOptions
): DatePickerFormatter | undefined

function createNativeLocaleFormatter (
  local: string | undefined,
  options: Intl.DateTimeFormatOptions,
  substrOptions: SubstrOptions
): DatePickerFormatter

function createNativeLocaleFormatter (
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
  substrOptions: SubstrOptions = { start: 0, length: 0 }
): DatePickerFormatter | undefined {
  const makeIsoString = (dateString: string) => {
    if (!dateString || dateString === 'undefined' || dateString === 'null') {
      return '1970-01-01' // fallback date
    }
    const [year, month, date] = dateString.trim().split(' ')[0].split('-')
    return [pad(year, 4), pad(month || 1), pad(date || 1)].join('-')
  }

  try {
    const intlFormatter = new Intl.DateTimeFormat(locale || undefined, options)
    return (dateString: string) => intlFormatter.format(new Date(`${makeIsoString(dateString)}T00:00:00+00:00`))
  } catch (e) {
    return (substrOptions.start || substrOptions.length)
      ? (dateString: string) => makeIsoString(dateString).substr(substrOptions.start || 0, substrOptions.length)
      : undefined
  }
}

export default createNativeLocaleFormatter
