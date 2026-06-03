import { CalendarPlus, Eye, Pencil, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { StatCard } from '../components/ui/StatCard'
import { loadEvents, removeEvent } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import type { EventPlan } from '../types/domain'
import { formatLKR } from '../utils/currency'
import { events as demoEvents } from '../utils/mockData'

const eventTypes = ['All', 'Wedding', 'Birthday', 'Engagement', 'Corporate', 'Anniversary', 'Party', 'Other']

export function EventsPage() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((state) => state.events)
  const [search, setSearch] = useState('')
  const [eventType, setEventType] = useState('All')

  useEffect(() => {
    dispatch(loadEvents({ search: search || undefined, eventType: eventType === 'All' ? undefined : eventType }))
  }, [dispatch, eventType, search])

  const displayEvents = items.length > 0 ? items : demoEvents
  const filtered = useMemo(
    () =>
      displayEvents.filter((event) => {
        const title = event.eventTitle ?? event.title ?? ''
        const type = event.eventType ?? event.type ?? ''
        const matchesSearch = `${title} ${event.venue} ${event.district ?? ''}`.toLowerCase().includes(search.toLowerCase())
        const matchesType = eventType === 'All' || type === eventType
        return matchesSearch && matchesType
      }),
    [displayEvents, eventType, search],
  )

  const upcoming = filtered.filter((event) => new Date(event.eventDate ?? event.date ?? '') >= new Date()).length
  const totalBudget = filtered.reduce((sum, event) => sum + Number(event.budget), 0)

  const handleDelete = async (event: EventPlan) => {
    const id = event._id ?? event.id
    if (!id) return
    try {
      await dispatch(removeEvent(id)).unwrap()
      toast.success('Event deleted')
    } catch {
      toast.error('Could not delete event. Demo records are read-only without the API.')
    }
  }

  return (
    <section className="section-shell py-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Event dashboard</p>
          <h1 className="font-display text-4xl font-bold">My Events</h1>
          <p className="mt-2 text-sm text-charcoal-800/68 dark:text-ivory-100/68">
            Add, search, filter, view and manage customer events with budget tracking.
          </p>
        </div>
        <Link to="/events/new">
          <Button icon={<CalendarPlus size={18} />}>Create event</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total events" value={`${filtered.length}`} trend="All active plans" icon={<CalendarPlus size={20} />} />
        <StatCard label="Upcoming events" value={`${upcoming}`} trend="Sorted by event date" icon={<Eye size={20} />} />
        <StatCard label="Total budget" value={formatLKR(totalBudget)} trend="Across filtered events" icon={<Pencil size={20} />} />
        <StatCard label="Vendor requests" value="8" trend="3 awaiting response" icon={<Search size={20} />} />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-soft dark:bg-charcoal-800 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-md border border-gold-100 px-3 py-2 dark:border-white/10">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search by event, venue or district"
          />
        </label>
        <select
          value={eventType}
          onChange={(event) => setEventType(event.target.value)}
          className="rounded-md border border-gold-100 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-charcoal-900"
        >
          {eventTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-soft dark:bg-charcoal-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-ivory-100 text-charcoal-800/65 dark:bg-white/5 dark:text-ivory-100/65">
              <tr>
                <th className="p-4">Event Name</th>
                <th>Event Type</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Budget</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => {
                const id = event._id ?? event.id
                return (
                  <tr key={id} className="border-t border-gold-100 dark:border-white/10">
                    <td className="p-4 font-semibold">{event.eventTitle ?? event.title}</td>
                    <td>{event.eventType ?? event.type}</td>
                    <td>{event.eventDate ?? event.date}</td>
                    <td>{event.venue}</td>
                    <td>{formatLKR(event.budget)}</td>
                    <td>
                      <span className="rounded-md bg-gold-100 px-2 py-1 text-xs font-bold text-gold-700 dark:bg-gold-300/15 dark:text-gold-300">
                        {event.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button aria-label="View event" className="grid size-9 place-items-center rounded-md hover:bg-ivory-100 dark:hover:bg-white/10">
                          <Eye size={16} />
                        </button>
                        <button aria-label="Edit event" className="grid size-9 place-items-center rounded-md hover:bg-ivory-100 dark:hover:bg-white/10">
                          <Pencil size={16} />
                        </button>
                        <button
                          aria-label="Delete event"
                          className="grid size-9 place-items-center rounded-md text-blush-700 hover:bg-blush-50"
                          onClick={() => handleDelete(event)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {loading && <p className="p-4 text-sm text-charcoal-800/60 dark:text-ivory-100/60">Loading latest events...</p>}
      </div>
    </section>
  )
}
