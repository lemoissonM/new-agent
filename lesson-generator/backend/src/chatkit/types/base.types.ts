export interface Page<T> {
  data: T[];
  has_more: boolean;
  after: string | null;
}

export type FeedbackKind = 'positive' | 'negative';

export type IconName =
  | 'analytics'
  | 'atom'
  | 'bolt'
  | 'book-open'
  | 'book-closed'
  | 'calendar'
  | 'chart'
  | 'circle-question'
  | 'compass'
  | 'cube'
  | 'globe'
  | 'keys'
  | 'lab'
  | 'images'
  | 'lifesaver'
  | 'lightbulb'
  | 'map-pin'
  | 'name'
  | 'notebook'
  | 'notebook-pencil'
  | 'page-blank'
  | 'profile'
  | 'profile-card'
  | 'search'
  | 'sparkle'
  | 'sparkle-double'
  | 'square-code'
  | 'square-image'
  | 'square-text'
  | 'suitcase'
  | 'write'
  | 'write-alt'
  | 'write-alt2';