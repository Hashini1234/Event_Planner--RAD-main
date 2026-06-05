import { Star, WandSparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { loadEvents } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchVendorRecommendations } from '../services/customerService'
import type { Vendor } from '../types/domain'
import { formatLKR } from '../utils/currency'

export function AiPlannerPage() {
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.events.items)
  const [eventId, setEventId] = useState('')
  const [recommendations, setRecommendations] = useState<Array<{ vendor: Vendor; score: number; reason: string }>>([])

  useEffect(() => {
    dispatch(loadEvents({}))
  }, [dispatch])

  useEffect(() => {
    if (!eventId && events[0]) setEventId(events[0]._id ?? events[0].id)
  }, [eventId, events])

  const generate = async () => {
    const event = events.find((item) => (item._id ?? item.id) === eventId)
    if (!event) {
      toast.error('Select an event first')
      return
    }
    try {
      const data = await fetchVendorRecommendations(event)
      setRecommendations(data)
      toast.success('Vendor recommendations generated')
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not generate recommendations'
      toast.error(message)
    }
  }

  return (
    <section className="px-4 py-8 text-ivory-50 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-gold-300">AI planner</p>
      <h1 className="font-display text-4xl font-bold">Smart vendor recommendations</h1>
      <p className="mt-2 max-w-2xl text-sm text-ivory-50/62">
        Recommendations use event type, budget, vendor rating and package price to find practical matches.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <label className="grid gap-2 text-sm font-medium">
            Event
            <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="field-dark">
              <option value="">Select event</option>
              {events.map((event) => <option key={event._id ?? event.id} value={event._id ?? event.id}>{event.eventTitle}</option>)}
            </select>
          </label>
          <Button className="mt-4 w-full" icon={<WandSparkles size={18} />} onClick={() => void generate()}>
            Generate recommendations
          </Button>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <h2 className="text-xl font-bold">Recommended vendors</h2>
          <div className="mt-4 grid gap-3">
            {recommendations.length === 0 && <p className="text-sm text-ivory-50/58">Choose an event and generate vendor matches.</p>}
            {recommendations.map((item) => (
              <article key={item.vendor._id ?? item.vendor.id} className="rounded-md border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <p className="text-xs font-bold uppercase text-gold-300">{item.vendor.category}</p>
                    <h3 className="mt-1 text-lg font-bold">{item.vendor.vendorName ?? item.vendor.businessName ?? item.vendor.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-ivory-50/68">{item.reason}</p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="inline-flex items-center gap-1 text-gold-300">
                      <Star size={15} fill="currentColor" /> {item.vendor.averageRating ?? item.vendor.rating}
                    </p>
                    <p className="mt-2 font-bold">{formatLKR(item.vendor.pricing ?? item.vendor.startingPrice ?? 0)}</p>
                    <p className="mt-1 text-xs text-ivory-50/58">Score {item.score}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
