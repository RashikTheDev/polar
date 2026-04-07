import { describe, expect, it } from 'vitest'
import { getOrganizationCreateErrorMessage } from './validation'

describe('getOrganizationCreateErrorMessage', () => {
  it('maps generic name length errors to the organization name field', () => {
    expect(
      getOrganizationCreateErrorMessage([
        {
          loc: ['body', 'name'],
          msg: 'String should have at least 3 characters',
          type: 'string_too_short',
        },
      ]),
    ).toBe('Organization name must be at least 3 characters')
  })

  it('normalizes function validator paths for slug errors', () => {
    expect(
      getOrganizationCreateErrorMessage([
        {
          loc: ['body', 'function-after[validate_reserved_keywords(), slug]'],
          msg: 'This slug is reserved.',
          type: 'value_error',
        },
      ]),
    ).toBe('Organization slug: This slug is reserved.')
  })

  it('falls back to the raw message when no field label is available', () => {
    expect(
      getOrganizationCreateErrorMessage([
        {
          loc: ['body', 'details', 'product_description'],
          msg: 'Validation failed',
          type: 'value_error',
        },
      ]),
    ).toBe('Validation failed')
  })
})
