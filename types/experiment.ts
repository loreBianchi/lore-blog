export interface Experiment {
  id: number
  slug: string
  title: string
  description: string
  longDescription: string
  category: string
  tech: string[]
  color: string
  icon: string
  status: 'live' | 'wip' | 'planned'
  demoUrl?: string
  githubUrl?: string
  articleUrl?: string
  features: string[]
  createdAt: string
  updatedAt: string
}