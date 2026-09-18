import { redirect } from 'next/navigation'
import { getFullSiteData } from '@/lib/content-store'
import { getPackageFurniture } from '@/lib/furniture'
import { AdminDashboard } from '@/components/admin-dashboard'
import { hasAdminAccess } from '@/lib/admin-access'

export default async function AdminPage() {
  if (!(await hasAdminAccess())) redirect('/admin/login')

  const [store, furniture] = await Promise.all([
    getFullSiteData(),
    Promise.all([1, 2, 3].map((id) => getPackageFurniture(id))),
  ])

  return (
    <AdminDashboard
      userName="إدارة معرض الشرق الأوسط"
      categories={store.categories}
      products={store.products}
      settings={store.settings}
      packages={store.packages}
      furniture={furniture}
      reviews={store.reviews}
      deliveries={store.deliveries}
    />
  )
}
