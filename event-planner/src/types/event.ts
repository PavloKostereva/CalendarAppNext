export type Importance = 'звичайна' | 'важлива' | 'критична';
export interface EventItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  datetime: any;
  importance: 'звичайна' | 'важлива' | 'критична';
  createdAt?: any;
  updatedAt?: any;
}