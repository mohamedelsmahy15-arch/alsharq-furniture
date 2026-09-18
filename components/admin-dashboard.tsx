'use client'

import { useState, useRef } from 'react'
import {
  updateProduct,
  createProduct,
  deleteProduct,
  updateCategory,
  createCategory,
  deleteCategory,
  updateSiteSettings,
  exportSiteData,
  importSiteData,
} from '@/app/actions/admin'
import { logoutAdmin } from '@/app/actions/admin-access'
import type { FurnitureCategory } from '@/lib/furniture'
import type {
  PackageData,
  ProductData,
  CategoryData,
  ReviewData,
  DeliveryData,
} from '@/lib/content-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Save,
  Trash2,
  Plus,
  Eye,
  LogOut,
  Building2,
  Sparkles,
  Gift,
  Armchair,
  Tag,
  ShieldCheck,
  Camera,
  Database,
  Download,
  Upload,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react'
import { AdminImageUpload, AdminGalleryUpload, uploadFile } from '@/components/admin-image-upload'
import { PackagesEditor } from '@/components/admin-packages-editor'
import { FurnitureEditor } from '@/components/admin-furniture-editor'
import { ShowcaseEditor } from '@/components/admin-showcase-editor'
import { AdminLivePreview } from '@/components/admin-live-preview'

type TabType =
  | 'general'
  | 'hero'
  | 'packages'
  | 'furniture'
  | 'products'
  | 'whyus'
  | 'showcase'
  | 'media_backup'

interface AdminDashboardProps {
  userName: string
  categories: CategoryData[]
  products: ProductData[]
  settings: Record<string, string>
  packages: PackageData[]
  furniture: FurnitureCategory[][]
  reviews: ReviewData[]
  deliveries: DeliveryData[]
}

export function AdminDashboard({
  userName,
  categories: initialCategories,
  products: initialProducts,
  settings: initialSettings,
  packages: initialPackages,
  furniture,
  reviews,
  deliveries,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<TabType>('general')
  const [site, setSite] = useState(initialSettings)
  const [categories, setCategories] = useState(initialCategories)
  const [products, setProducts] = useState(initialProducts)
  const [savingSettings, setSavingSettings] = useState(false)

  const handleSaveSettings = async (customValues?: Record<string, string>) => {
    const toSave = customValues || site
    setSavingSettings(true)
    try {
      await updateSiteSettings(toSave)
      toast.success('تم حفظ وتحديث الإعدادات بنجاح')
    } catch {
      toast.error('تعذر حفظ الإعدادات')
    } finally {
      setSavingSettings(false)
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-muted/20 pb-20 pt-6">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        {/* Top Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-card p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-3 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                لوحة التحكم المركزية والشاملة
              </p>
            </div>
            <h1 className="mt-1 font-heading text-2xl font-extrabold md:text-3xl">
              إدارة محتوى {site.name || 'معرض الشرق الأوسط للأثاث'}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              مرحباً بك، {userName} — لديك القدرة المطلقة على تعديل أي نص، صورة، سعر، أو فيديو في الموقع.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Eye className="size-4" />
                معاينة الموقع الرئيسي
                <ExternalLink className="size-3" />
              </a>
            </Button>
            <form action={logoutAdmin}>
              <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                <LogOut className="size-4" />
                تسجيل الخروج
              </Button>
            </form>
          </div>
        </header>

        {/* Navigation Tabs Bar */}
        <nav className="mb-8 flex flex-wrap gap-2 rounded-2xl border bg-card/60 p-2 backdrop-blur">
          <TabButton
            active={tab === 'general'}
            onClick={() => setTab('general')}
            icon={Building2}
            label="الهوية والتواصل"
          />
          <TabButton
            active={tab === 'hero'}
            onClick={() => setTab('hero')}
            icon={Sparkles}
            label="واجهة الهيرو الرئيسية"
          />
          <TabButton
            active={tab === 'packages'}
            onClick={() => setTab('packages')}
            icon={Gift}
            label="الباقات والعروض"
          />
          <TabButton
            active={tab === 'furniture'}
            onClick={() => setTab('furniture')}
            icon={Armchair}
            label="خيارات تفصيل الأثاث"
          />
          <TabButton
            active={tab === 'products'}
            onClick={() => setTab('products')}
            icon={Tag}
            label="الأقسام والمنتجات"
          />
          <TabButton
            active={tab === 'whyus'}
            onClick={() => setTab('whyus')}
            icon={ShieldCheck}
            label="لماذا نحن"
          />
          <TabButton
            active={tab === 'showcase'}
            onClick={() => setTab('showcase')}
            icon={Camera}
            label="التسليمات والتقييمات"
          />
          <TabButton
            active={tab === 'media_backup'}
            onClick={() => setTab('media_backup')}
            icon={Database}
            label="الوسائط والنسخ الاحتياطي"
          />
        </nav>

        {/* Tab 1: General & Contact Info */}
        {tab === 'general' && (
          <div className="grid items-start gap-8 xl:grid-cols-[1fr_400px]">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">بيانات وهوية المعرض والتواصل</CardTitle>
                <p className="text-xs text-muted-foreground">
                  تعديل الاسم والشعار وأرقام الهاتف والواتساب والعنوان ومواعيد العمل وكود الخريطة.
                </p>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-semibold">
                  <span>اسم المعرض الظاهر</span>
                  <Input
                    value={site.name ?? ''}
                    onChange={(e) => setSite({ ...site, name: e.target.value })}
                    placeholder="الشرق الأوسط للأثاث"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  <span>المدينة / المحافظة</span>
                  <Input
                    value={site.city ?? ''}
                    onChange={(e) => setSite({ ...site, city: e.target.value })}
                    placeholder="الإسكندرية"
                  />
                </label>

                <div className="md:col-span-2">
                  <AdminImageUpload
                    label="لوجو وشعار المعرض (اختياري، يظهر في الهيدر)"
                    value={site.logoImage ?? ''}
                    onChange={(url) => setSite({ ...site, logoImage: url })}
                    placeholder="رابط صورة الشعار أو ارفع من جهازك..."
                  />
                </div>

                <label className="grid gap-1.5 text-sm font-semibold">
                  <span>رقم الهاتف للاتصال المباشر</span>
                  <Input
                    value={site.phoneDisplay ?? ''}
                    onChange={(e) => setSite({ ...site, phoneDisplay: e.target.value })}
                    placeholder="01221250044"
                    dir="ltr"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  <span>رقم الواتساب الدولي (بدون + أو مسافات)</span>
                  <Input
                    value={site.whatsapp ?? ''}
                    onChange={(e) => setSite({ ...site, whatsapp: e.target.value })}
                    placeholder="201221250044"
                    dir="ltr"
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                  <span>رسالة الواتساب التلقائية عند ضغط الزر</span>
                  <Input
                    value={site.whatsappDefaultMessage ?? ''}
                    onChange={(e) => setSite({ ...site, whatsappDefaultMessage: e.target.value })}
                    placeholder="السلام عليكم، أرغب في الاستفسار عن الأثاث والعروض المتاحة."
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                  <span>العنوان بالتفصيل</span>
                  <Textarea
                    rows={2}
                    value={site.address ?? ''}
                    onChange={(e) => setSite({ ...site, address: e.target.value })}
                    placeholder="3 شارع فرنسا ,المنشية، الإسكندرية..."
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                  <span>مواعيد العمل</span>
                  <Input
                    value={site.hours ?? ''}
                    onChange={(e) => setSite({ ...site, hours: e.target.value })}
                    placeholder="يوميًا من 11 صباحًا حتى 11 مساءً"
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                  <span>رابط موقع المعرض على خرائط جوجل (Google Maps Link)</span>
                  <Input
                    value={site.mapLink ?? ''}
                    onChange={(e) => setSite({ ...site, mapLink: e.target.value })}
                    placeholder="https://maps.app.goo.gl/..."
                    dir="ltr"
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                  <span>رابط تضمين الخريطة (iframe embed src)</span>
                  <Input
                    value={site.mapEmbed ?? ''}
                    onChange={(e) => setSite({ ...site, mapEmbed: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?..."
                    dir="ltr"
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                  <span>نص حقوق النشر وتذييل الموقع (Footer)</span>
                  <Input
                    value={site.footerText ?? ''}
                    onChange={(e) => setSite({ ...site, footerText: e.target.value })}
                    placeholder="جميع الحقوق محفوظة للمعرض."
                  />
                </label>

                <div className="flex items-center justify-between border-t pt-4 md:col-span-2">
                  <span className="text-xs text-muted-foreground">
                    اضغط حفظ لتطبيق التغييرات ونشرها على الموقع فوراً.
                  </span>
                  <Button onClick={() => handleSaveSettings()} disabled={savingSettings}>
                    <Save className="size-4" />
                    {savingSettings ? 'جاري الحفظ...' : 'حفظ ونشر التغييرات'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="sticky top-6">
              <AdminLivePreview site={site} />
            </div>
          </div>
        )}

        {/* Tab 2: Hero Section */}
        {tab === 'hero' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تعديل واجهة الهيرو الرئيسية (Hero Section)</CardTitle>
              <p className="text-xs text-muted-foreground">
                تغيير نصوص الترحيب، رفع أو استبدال فيديو الخلفية، وتعديل نصوص الأزرار.
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                <span>شارة الهيرو العلوية (Badge)</span>
                <Input
                  value={site.heroBadge ?? ''}
                  onChange={(e) => setSite({ ...site, heroBadge: e.target.value })}
                  placeholder="معرض الأثاث الأول في الإسكندرية"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                <span>العنوان الرئيسي الكبير (Hero Title)</span>
                <Input
                  value={site.heroTitle ?? ''}
                  onChange={(e) => setSite({ ...site, heroTitle: e.target.value })}
                  placeholder="بيتك يبدأ من هنا"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
                <span>الوصف التوضيحي للهيرو</span>
                <Textarea
                  rows={2}
                  value={site.heroDescription ?? ''}
                  onChange={(e) => setSite({ ...site, heroDescription: e.target.value })}
                  placeholder="غرف نوم، ركنات، انتريهات، سفر، غرف أطفال، صالونات"
                />
              </label>

              <div className="rounded-2xl border bg-muted/20 p-4">
                <AdminImageUpload
                  label="فيديو الخلفية للواجهة (MP4)"
                  value={site.heroVideo ?? ''}
                  onChange={(url) => setSite({ ...site, heroVideo: url })}
                  isVideo={true}
                  accept="video/*"
                  placeholder="/hero-video.mp4 أو ارفع ملف فيديو..."
                />
              </div>

              <div className="rounded-2xl border bg-muted/20 p-4">
                <AdminImageUpload
                  label="صورة البوستر البديلة للفيديو (Poster Image)"
                  value={site.heroPoster ?? ''}
                  onChange={(url) => setSite({ ...site, heroPoster: url })}
                  placeholder="/hero-living-room.png أو ارفع صورة..."
                />
              </div>

              <label className="grid gap-1.5 text-sm font-semibold">
                <span>نص زر الواتساب</span>
                <Input
                  value={site.heroWhatsappText ?? ''}
                  onChange={(e) => setSite({ ...site, heroWhatsappText: e.target.value })}
                  placeholder="تواصل عبر واتساب"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold">
                <span>نص زر مشاهدة العروض</span>
                <Input
                  value={site.heroOffersText ?? ''}
                  onChange={(e) => setSite({ ...site, heroOffersText: e.target.value })}
                  placeholder="مشاهدة العروض"
                />
              </label>

              <div className="flex justify-end border-t pt-4 md:col-span-2">
                <Button onClick={() => handleSaveSettings()} disabled={savingSettings}>
                  <Save className="size-4" />
                  {savingSettings ? 'جاري الحفظ...' : 'حفظ واجهة الهيرو'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Packages & Offers */}
        {tab === 'packages' && <PackagesEditor packages={initialPackages} settings={site} />}

        {/* Tab 4: Furniture Configurator Options */}
        {tab === 'furniture' && <FurnitureEditor furniture={furniture} />}

        {/* Tab 5: Categories & Products */}
        {tab === 'products' && (
          <ProductsAndCategoriesManager
            categories={categories}
            setCategories={setCategories}
            products={products}
            setProducts={setProducts}
            site={site}
            setSite={setSite}
            onSaveSettings={handleSaveSettings}
          />
        )}

        {/* Tab 6: Why Us */}
        {tab === 'whyus' && (
          <WhyUsEditor
            site={site}
            setSite={setSite}
            onSave={handleSaveSettings}
            saving={savingSettings}
          />
        )}

        {/* Tab 7: Showcase & Reviews */}
        {tab === 'showcase' && (
          <ShowcaseEditor reviews={reviews} deliveries={deliveries} settings={site} />
        )}

        {/* Tab 8: Media Uploader & Full Backup/Restore */}
        {tab === 'media_backup' && <MediaAndBackupManager />}
      </div>
    </main>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: any
  label: string
}) {
  return (
    <Button
      variant={active ? 'default' : 'ghost'}
      size="sm"
      onClick={onClick}
      className={`rounded-xl transition-all ${
        active ? 'font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="size-4" />
      {label}
    </Button>
  )
}

// ---------------- Products & Categories Manager ----------------
function ProductsAndCategoriesManager({
  categories,
  setCategories,
  products,
  setProducts,
  site,
  setSite,
  onSaveSettings,
}: {
  categories: CategoryData[]
  setCategories: (c: CategoryData[]) => void
  products: ProductData[]
  setProducts: (p: ProductData[]) => void
  site: Record<string, string>
  setSite: (s: Record<string, string>) => void
  onSaveSettings: (v?: Record<string, string>) => Promise<void>
}) {
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all')
  const [savingProd, setSavingProd] = useState<number | null>(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', heroImage: '' })

  const patchProduct = (id: number, values: Partial<ProductData>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...values } : p)))
  }

  const saveSingleProduct = async (product: ProductData) => {
    setSavingProd(product.id)
    try {
      await updateProduct(product)
      toast.success(`تم حفظ المنتج ${product.name}`)
    } catch {
      toast.error('فشل حفظ المنتج')
    } finally {
      setSavingProd(null)
    }
  }

  const addNewProduct = async () => {
    const catId = typeof selectedCategory === 'number' ? selectedCategory : categories[0]?.id || 1
    const created = await createProduct({
      categoryId: catId,
      name: 'منتج جديد',
      price: 15000,
      originalPrice: 20000,
      image: '/placeholder.svg',
      longDescription: 'وصف المنتج بالتفصيل...',
      note: 'جديد',
      inStock: true,
      gallery: [],
      specs: [{ label: 'الخامة', value: 'خشب زان' }],
    })
    setProducts([...products, created])
    toast.success('تم إنشاء المنتج الجديد')
  }

  const handleCreateCategory = async () => {
    if (!newCat.name) return toast.error('يرجى كتابة اسم التصنيف')
    const slug = newCat.slug || `category-${Date.now()}`
    try {
      const created = await createCategory({
        name: newCat.name,
        slug,
        description: newCat.description,
        heroImage: newCat.heroImage || '/placeholder.svg',
      })
      setCategories([...categories, created])
      setNewCat({ name: '', slug: '', description: '', heroImage: '' })
      setShowAddCategory(false)
      toast.success('تمت إضافة التصنيف بنجاح')
    } catch {
      toast.error('فشل إضافة التصنيف')
    }
  }

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.categoryId === selectedCategory)

  return (
    <div className="grid gap-8">
      {/* Products Coming Soon Toggle & Section Info */}
      <Card>
        <CardContent className="grid gap-4 p-6 md:grid-cols-2">
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gold/10 p-4 md:col-span-2">
            <div>
              <span className="block font-bold">وضع منتجاتنا قريباً (Products Coming Soon)</span>
              <span className="text-xs text-muted-foreground">
                تفعيل هذا الخيار يخفي أقسام المنتجات عن الزوار مؤقتاً ويعرض شاشة قريباً مع بقاء الباقات والصفحة تعمل.
              </span>
            </div>
            <input
              type="checkbox"
              checked={site.productsComingSoon === 'true'}
              onChange={(e) => {
                const updated = { ...site, productsComingSoon: e.target.checked ? 'true' : 'false' }
                setSite(updated)
                onSaveSettings(updated)
              }}
              className="size-6 accent-gold cursor-pointer"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold">
            <span>شارة قسم المنتجات</span>
            <Input
              value={site.productsSectionBadge ?? 'تشكيلتنا'}
              onChange={(e) => setSite({ ...site, productsSectionBadge: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold">
            <span>عنوان قسم المنتجات الرئيسي</span>
            <Input
              value={site.productsSectionTitle ?? 'منتجاتنا'}
              onChange={(e) => setSite({ ...site, productsSectionTitle: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
            <span>وصف قسم المنتجات</span>
            <Input
              value={site.productsSectionDesc ?? ''}
              onChange={(e) => setSite({ ...site, productsSectionDesc: e.target.value })}
              placeholder="كل ما يحتاجه بيتك من قطع أثاث فاخرة..."
            />
          </label>

          <div className="flex justify-end md:col-span-2">
            <Button size="sm" onClick={() => onSaveSettings()}>
              <Save className="size-4" />
              حفظ نصوص قسم المنتجات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
          <div>
            <CardTitle className="text-lg">إدارة تصنيفات الأثاث ({categories.length})</CardTitle>
            <p className="text-xs text-muted-foreground">
              غرف نوم، ركنات، انتريهات، غرف أطفال، سفرة... إلخ
            </p>
          </div>
          <Button size="sm" onClick={() => setShowAddCategory(!showAddCategory)}>
            <Plus className="size-4" />
            {showAddCategory ? 'إغلاق' : 'إضافة تصنيف جديد'}
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 p-6">
          {showAddCategory && (
            <div className="grid gap-4 rounded-2xl border-2 border-primary/20 bg-muted/30 p-5">
              <h4 className="font-bold">إضافة تصنيف جديد</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="اسم التصنيف (مثال: صالونات فاخرة)"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                />
                <Input
                  placeholder="المعرّف slug (مثال: luxury-salons)"
                  value={newCat.slug}
                  onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                />
              </div>
              <Input
                placeholder="وصف التصنيف..."
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
              />
              <AdminImageUpload
                label="صورة التصنيف الرئيسية"
                value={newCat.heroImage}
                onChange={(url) => setNewCat({ ...newCat, heroImage: url })}
              />
              <Button onClick={handleCreateCategory}>
                <Plus className="size-4" />
                حفظ التصنيف
              </Button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.id} className="grid gap-3 rounded-2xl border bg-card p-4">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <img src={cat.heroImage || '/placeholder.svg'} alt={cat.name} className="size-full object-cover" />
                </div>
                <Input
                  value={cat.name}
                  onChange={(e) => {
                    const updated = categories.map((c) => (c.id === cat.id ? { ...c, name: e.target.value } : c))
                    setCategories(updated)
                  }}
                  placeholder="اسم التصنيف"
                  className="font-bold"
                />
                <Input
                  value={cat.description}
                  onChange={(e) => {
                    const updated = categories.map((c) => (c.id === cat.id ? { ...c, description: e.target.value } : c))
                    setCategories(updated)
                  }}
                  placeholder="وصف التصنيف"
                  className="text-xs"
                />
                <AdminImageUpload
                  label="صورة الهيرو"
                  value={cat.heroImage}
                  onChange={(url) => {
                    const updated = categories.map((c) => (c.id === cat.id ? { ...c, heroImage: url } : c))
                    setCategories(updated)
                  }}
                />
                <div className="flex items-center justify-between border-t pt-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      await updateCategory(cat)
                      toast.success(`تم حفظ تصنيف ${cat.name}`)
                    }}
                  >
                    <Save className="size-3" />
                    حفظ التصنيف
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={async () => {
                      if (confirm(`حذف تصنيف "${cat.name}" وجميع المنتجات المرتبطة به؟`)) {
                        await deleteCategory(cat.id)
                        setCategories(categories.filter((c) => c.id !== cat.id))
                        toast.success('تم حذف التصنيف')
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products list & filter */}
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">إدارة المنتجات ({filteredProducts.length})</h2>
            <p className="text-xs text-muted-foreground">
              أضف أو عدل أو احذف أي منتج في المعرض مع رفع صوره ومواصفاته الفنية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-10 rounded-xl border bg-card px-3 text-sm font-semibold"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
            >
              <option value="all">جميع التصنيفات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <Button onClick={addNewProduct}>
              <Plus className="size-4" />
              إضافة منتج جديد
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 py-3">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base font-bold">{product.name}</CardTitle>
                  <Badge variant={product.inStock ? 'secondary' : 'destructive'}>
                    {product.inStock ? 'متوفر' : 'غير متوفر'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveSingleProduct(product)}
                    disabled={savingProd === product.id}
                  >
                    <Save className="size-4" />
                    {savingProd === product.id ? 'جاري الحفظ...' : 'حفظ المنتج'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      if (confirm(`حذف منتج "${product.name}"؟`)) {
                        await deleteProduct(product.id)
                        setProducts(products.filter((p) => p.id !== product.id))
                        toast.success('تم حذف المنتج')
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                    حذف
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 p-6 md:grid-cols-[240px_1fr]">
                {/* Image upload */}
                <div className="grid gap-3">
                  <AdminImageUpload
                    label="الصورة الرئيسية للمنتج"
                    value={product.image}
                    onChange={(url) => patchProduct(product.id, { image: url })}
                  />
                  <label className="flex items-center gap-2 rounded-lg border p-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.inStock}
                      onChange={(e) => patchProduct(product.id, { inStock: e.target.checked })}
                      className="size-4 accent-primary"
                    />
                    <span>المنتج متوفر بالمخزن</span>
                  </label>
                </div>

                {/* Details */}
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    <label className="grid gap-1 text-xs font-semibold">
                      <span>اسم المنتج</span>
                      <Input
                        value={product.name}
                        onChange={(e) => patchProduct(product.id, { name: e.target.value })}
                        placeholder="اسم المنتج"
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold">
                      <span>التصنيف</span>
                      <select
                        className="h-9 rounded-lg border bg-background px-3 text-xs"
                        value={product.categoryId}
                        onChange={(e) =>
                          patchProduct(product.id, { categoryId: Number(e.target.value) })
                        }
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold">
                      <span>الشارة / ملاحظة (Note)</span>
                      <Input
                        value={product.note ?? ''}
                        onChange={(e) => patchProduct(product.id, { note: e.target.value })}
                        placeholder="مثال: الأكثر طلباً"
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold">
                      <span>السعر الحالي (جنيه)</span>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) =>
                          patchProduct(product.id, { price: Number(e.target.value) })
                        }
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold">
                      <span>السعر قبل الخصم (جنيه)</span>
                      <Input
                        type="number"
                        value={product.originalPrice}
                        onChange={(e) =>
                          patchProduct(product.id, { originalPrice: Number(e.target.value) })
                        }
                      />
                    </label>
                  </div>

                  <label className="grid gap-1 text-xs font-semibold">
                    <span>الوصف التفصيلي للمنتج</span>
                    <Textarea
                      rows={2}
                      value={product.longDescription}
                      onChange={(e) =>
                        patchProduct(product.id, { longDescription: e.target.value })
                      }
                      placeholder="شرح خامات وتفاصيل المنتج..."
                    />
                  </label>

                  <AdminGalleryUpload
                    label="معرض صور إضافية للمنتج"
                    values={product.gallery || []}
                    onChange={(urls) => patchProduct(product.id, { gallery: urls })}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------- Why Us Editor ----------------
function WhyUsEditor({
  site,
  setSite,
  onSave,
  saving,
}: {
  site: Record<string, string>
  setSite: (s: Record<string, string>) => void
  onSave: (v?: Record<string, string>) => Promise<void>
  saving: boolean
}) {
  let reasons = [
    {
      title: 'الثقة',
      desc: 'سمعة بُنيت على مدار سنوات وآلاف العملاء الراضين عن جودة وخدمة المعرض.',
      icon: 'ShieldCheck',
    },
    {
      title: 'الخامات',
      desc: 'أفضل أنواع الأخشاب والأقمشة المختارة بعناية لتدوم معك لسنوات طويلة.',
      icon: 'Gem',
    },
    {
      title: 'الخبرة',
      desc: 'فريق متخصص في تصميم وتجهيز البيوت يساعدك على اختيار الأنسب لمساحتك.',
      icon: 'Award',
    },
    {
      title: 'خدمة ما بعد البيع',
      desc: 'متابعة وصيانة وضمان حقيقي بعد الاستلام — راحتك تهمنا دائمًا.',
      icon: 'Headphones',
    },
  ]

  if (site.whyUsReasons) {
    try {
      const parsed = JSON.parse(site.whyUsReasons)
      if (Array.isArray(parsed) && parsed.length > 0) reasons = parsed
    } catch {}
  }

  const [cards, setCards] = useState(reasons)

  const updateCard = (index: number, patch: Partial<(typeof reasons)[0]>) => {
    const updated = cards.map((c, i) => (i === index ? { ...c, ...patch } : c))
    setCards(updated)
    setSite({ ...site, whyUsReasons: JSON.stringify(updated) })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">تعديل قسم "لماذا نحن" والمزايا التنافسية</CardTitle>
        <p className="text-xs text-muted-foreground">
          عدل نصوص وعناوين وأسباب اختيار المعرض التي تظهر لزوار الموقع.
        </p>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>شارة القسم (Badge)</span>
            <Input
              value={site.whyUsBadge ?? 'لماذا نحن'}
              onChange={(e) => setSite({ ...site, whyUsBadge: e.target.value })}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            <span>عنوان القسم الرئيسي</span>
            <Input
              value={site.whyUsTitle ?? 'لماذا الشرق الأوسط للأثاث؟'}
              onChange={(e) => setSite({ ...site, whyUsTitle: e.target.value })}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card, idx) => (
            <div key={idx} className="grid gap-3 rounded-2xl border bg-muted/20 p-4">
              <span className="text-xs font-bold text-primary">الميزة #{idx + 1}</span>
              <Input
                value={card.title}
                onChange={(e) => updateCard(idx, { title: e.target.value })}
                placeholder="عنوان الميزة"
                className="font-bold"
              />
              <Textarea
                rows={2}
                value={card.desc}
                onChange={(e) => updateCard(idx, { desc: e.target.value })}
                placeholder="شرح الميزة..."
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t pt-4">
          <Button onClick={() => onSave({ ...site, whyUsReasons: JSON.stringify(cards) })} disabled={saving}>
            <Save className="size-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ قسم لماذا نحن'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------- Media & Backup Manager ----------------
function MediaAndBackupManager() {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jsonInputRef = useRef<HTMLInputElement>(null)

  const handleQuickUpload = async (file: File) => {
    setUploading(true)
    const toastId = toast.loading('جاري رفع الملف من جهازك...')
    try {
      const url = await uploadFile(file)
      setUploadedUrl(url)
      toast.success('تم رفع الملف بنجاح! تم توليد الرابط.', { id: toastId })
    } catch (err: any) {
      toast.error(err?.message || 'فشل رفع الملف', { id: toastId })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleExport = async () => {
    try {
      const json = await exportSiteData()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `furniture-expo-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('تم تنزيل النسخة الاحتياطية بنجاح')
    } catch {
      toast.error('فشل تصدير البيانات')
    }
  }

  const handleImport = async (file: File) => {
    setImporting(true)
    try {
      const text = await file.text()
      const res = await importSiteData(text)
      if (res.success) {
        toast.success(res.message)
        setTimeout(() => location.reload(), 1000)
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية')
    } finally {
      setImporting(false)
      if (jsonInputRef.current) jsonInputRef.current.value = ''
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Media Uploader */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">رافع الوسائط السريع (مكتبة الصور والفيديوهات)</CardTitle>
          <p className="text-xs text-muted-foreground">
            ارفع أي صورة أو فيديو من جهازك واحصل على رابطه المباشر لاستخدامه في أي مكان داخل الموقع.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors hover:border-primary hover:bg-muted/30"
          >
            <Upload className="size-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-bold">اضغط لاختيار صورة أو فيديو من جهازك</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP, MP4 حتى 50 ميجابايت</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && handleQuickUpload(e.target.files[0])}
            />
          </div>

          {uploading && (
            <p className="text-center text-xs font-semibold text-primary animate-pulse">
              جاري رفع الملف إلى الخادم...
            </p>
          )}

          {uploadedUrl && (
            <div className="grid gap-2 rounded-xl border bg-muted/40 p-4">
              <span className="text-xs font-bold text-emerald-600">تم الرفع بنجاح! الرابط:</span>
              <div className="flex items-center gap-2">
                <Input value={uploadedUrl} readOnly dir="ltr" className="text-xs font-mono" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(uploadedUrl)
                    setCopied(true)
                    toast.success('تم نسخ الرابط إلى الحافظة')
                    setTimeout(() => setCopied(false), 2000)
                  }}
                >
                  {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                  {copied ? 'تم النسخ' : 'نسخ'}
                </Button>
              </div>
              {uploadedUrl.endsWith('.mp4') ? (
                <video src={uploadedUrl} controls className="mt-2 max-h-36 rounded-lg" />
              ) : (
                <img src={uploadedUrl} alt="المرفوع" className="mt-2 max-h-36 rounded-lg object-contain" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">النسخ الاحتياطي والأمان (Backup & Restore)</CardTitle>
          <p className="text-xs text-muted-foreground">
            حفظ كافة بيانات وتعديلات الموقع بملف واحد واسترجاعها في أي لحظة.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2 rounded-2xl border p-5">
            <h4 className="font-bold">تصدير وتنزيل نسخة احتياطية كاملة</h4>
            <p className="text-xs text-muted-foreground">
              تنزيل ملف JSON يحتوي على كافة الإعدادات والباقات والمنتجات والتصنيفات والتقييمات والتسليمات.
            </p>
            <Button onClick={handleExport} className="mt-2 w-fit">
              <Download className="size-4" />
              تنزيل ملف النسخة الاحتياطية (JSON)
            </Button>
          </div>

          <div className="grid gap-2 rounded-2xl border p-5">
            <h4 className="font-bold">استرجاع نسخة احتياطية من ملف</h4>
            <p className="text-xs text-muted-foreground">
              اختر ملف JSON قمت بتنزيله مسبقاً لاستعادة الموقع لحالته المحفوظة فوراً.
            </p>
            <div className="mt-2">
              <Button
                variant="outline"
                disabled={importing}
                onClick={() => jsonInputRef.current?.click()}
              >
                <Upload className="size-4" />
                {importing ? 'جاري الاسترجاع...' : 'اختر ملف النسخة الاحتياطية واسترجعها'}
              </Button>
              <input
                ref={jsonInputRef}
                type="file"
                accept=".json"
                className="hidden"
                disabled={importing}
                onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
