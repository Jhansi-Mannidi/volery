/**
 * Rating icon utility for displaying competitive analysis ratings
 * Provides visual indicators for strong, adequate, and weak ratings
 */

export type RatingType = 'strong' | 'adequate' | 'weak' | 'n/a'

export function getRatingIcon(rating: RatingType): string {
  switch (rating) {
    case 'strong':
      return '✅'
    case 'adequate':
      return '⚠️'
    case 'weak':
      return '❌'
    case 'n/a':
      return '—'
    default:
      return '—'
  }
}

export function getRatingColor(rating: RatingType): string {
  switch (rating) {
    case 'strong':
      return 'bg-green-50 text-green-900'
    case 'adequate':
      return 'bg-yellow-50 text-yellow-900'
    case 'weak':
      return 'bg-red-50 text-red-900'
    case 'n/a':
      return 'bg-gray-50 text-gray-900'
    default:
      return 'bg-gray-50'
  }
}
