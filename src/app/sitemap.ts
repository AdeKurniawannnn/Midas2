import { MetadataRoute } from 'next'
import { generateSitemapData } from '@/lib/utils/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemapData()
}