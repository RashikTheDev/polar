import { normalizeValidationErrors } from '@/utils/api/errors'
import { isValidationError, schemas } from '@polar-sh/client'

export const ORGANIZATION_MIN_LENGTH = 3

const ORGANIZATION_CREATE_FIELD_LABELS: Record<string, string> = {
  email: 'Support email',
  name: 'Organization name',
  registered_name: 'Registered business name',
  slug: 'Organization slug',
  website: 'Website',
}

const getFieldLabel = (
  error: schemas['ValidationError'],
): string | undefined => {
  for (let index = error.loc.length - 1; index >= 0; index -= 1) {
    const segment = String(error.loc[index])
    if (segment in ORGANIZATION_CREATE_FIELD_LABELS) {
      return ORGANIZATION_CREATE_FIELD_LABELS[segment]
    }
  }

  return undefined
}

const formatValidationMessage = (
  fieldLabel: string | undefined,
  message: string,
): string => {
  if (!fieldLabel) {
    return message
  }

  const tooShortMatch = message.match(
    /^String should have at least (\d+) characters$/,
  )
  if (tooShortMatch) {
    return `${fieldLabel} must be at least ${tooShortMatch[1]} characters`
  }

  if (message === 'Field required') {
    return `${fieldLabel} is required`
  }

  return `${fieldLabel}: ${message}`
}

export const getOrganizationCreateErrorMessage = (detail: unknown): string => {
  if (typeof detail === 'string') {
    return detail
  }

  if (!isValidationError(detail) || detail.length === 0) {
    return 'Something went wrong, please try again.'
  }

  const [error] = normalizeValidationErrors(detail)
  const fieldLabel = getFieldLabel(error)

  return formatValidationMessage(fieldLabel, error.msg || 'Validation failed')
}
