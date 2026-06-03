import { Filter, Search, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { vendors } from '../utils/mockData'
import { formatLKR } from '../utils/currency'

const categories = ['All', 'Photography', 'Catering', 'Decoration', 'Music/DJ', 'Makeup', 'Bridal Services', 'Hotels', 'Event Halls']

export function MarketplacePage() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      vendors.filter((vendor) => {
        const matchesCategory = category === 'All' || vendor.category === category
        const matchesQuery = `${vendor.name} ${vendor.city} ${vendor.tags.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase())
        return matchesCategory && matchesQuery
      }),
    [category, query],
  )

  return (
    <section className="section-shell py-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Vendor marketplace</p>
          <h1 className="font-display text-4xl font-bold">Find verified Sri Lankan event partners</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-h-11 items-center gap-2 rounded-md border border-gold-100 bg-white px-3 dark:border-white/10 dark:bg-charcoal-800">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search city, style or vendor"
              className="w-full bg-transparent text-sm outline-none sm:w-64"
            />
          </label>
          <Button variant="secondary" icon={<Filter size={18} />}>Compare</Button>
        </div>
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition ${
              category === item
                ? 'bg-charcoal-900 text-white dark:bg-gold-300 dark:text-charcoal-900'
                : 'bg-white text-charcoal-800 shadow-soft dark:bg-white/10 dark:text-ivory-100'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vendor) => (
          <article key={vendor.id} className="overflow-hidden rounded-lg bg-white shadow-soft dark:bg-charcoal-800">
            <img src={vendor.image} alt={vendor.name} className="h-56 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gold-700 dark:text-gold-300">{vendor.category}</p>
                  <h2 className="mt-1 text-xl font-bold">{vendor.name}</h2>
                  <p className="text-sm text-charcoal-800/65 dark:text-ivory-100/65">{vendor.city}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-gold-100 px-2 py-1 text-xs font-bold text-gold-700 dark:bg-gold-300/15 dark:text-gold-300">
                  <Star size={14} fill="currentColor" /> {vendor.rating}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {vendor.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-ivory-100 px-2 py-1 text-xs dark:bg-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-sm">
                  From <span className="font-bold">{formatLKR(vendor.startingPrice)}</span>
                </p>
                <Button>Book vendor</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
