import { CalendarClock, CalendarPlus, Eye, Pencil, Search, Trash2, WalletCards, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { StatCard } from '../components/ui/StatCard'
import { editEvent, loadEvents, removeEvent } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchMyBookings } from '../services/customerService'
import type { EventPlan } from '../types/domain'
import { formatLKR } from '../utils/currency'

const eventTypes = ['All', 'Wedding', 'Birthday', 'Engagement', 'Corporate', 'Anniversary', 'Party', 'Other']
const statuses = ['All', 'Planning', 'Confirmed', 'Completed', 'Cancelled']

export function EventsPage() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((state) => state.events)
  const [search, setSearch] = useState('')
  const [eventType, setEventType] = useState('All')
  const [status, setStatus] = useState('All')
  const [editing, setEditing] = useState<EventPlan | null>(null)
  const [viewing, setViewing] = useState<EventPlan | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EventPlan | null>(null)
  const [vendorRequests, setVendorRequests] = useState(0)

  useEffect(() => {
    dispatch(
      loadEvents({
        search: search || undefined,
        eventType: eventType === 'All' ? undefined : eventType,
        status: status === 'All' ? undefined : status,
      }),
    )
  }, [dispatch, eventType, search, status])

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookings = await fetchMyBookings()
        setVendorRequests(bookings.length)
      } catch {
        setVendorRequests(0)
      }
    }
    void loadBookings()
  }, [])

  const filtered = useMemo(
    () =>
      items.filter((event) => {
        const title = event.eventTitle ?? event.title ?? ''
        const type = event.eventType ?? event.type ?? ''
        const matchesSearch = `${title} ${event.venue} ${event.district ?? ''}`.toLowerCase().includes(search.toLowerCase())
        const matchesType = eventType === 'All' || type === eventType
        const matchesStatus = status === 'All' || event.status === status
        return matchesSearch && matchesType && matchesStatus
      }),
    [eventType, items, search, status],
  )

  const upcoming = items.filter((event) => {
    const date = getEventDate(event)
    return date ? date >= startOfToday() && event.status !== 'Cancelled' : false
  }).length
  const totalBudget = items.reduce((sum, event) => sum + Number(event.budget || 0), 0)

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const id = deleteTarget._id ?? deleteTarget.id
    if (!id) return
    try {
      await dispatch(removeEvent(id)).unwrap()
      toast.success('Event deleted')
      setDeleteTarget(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete event')
    }
  }

  const handleEdit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (!editing) return
    const id = editing._id ?? editing.id
    const form = new FormData(submitEvent.currentTarget)
    const formData = new FormData()
    ;[
      'eventTitle',
      'eventType',
      'eventDate',
      'startTime',
      'endTime',
      'venue',
      'district',
      'guestCount',
      'budget',
      'status',
      'description',
      'theme',
      'notes',
    ].forEach((key) => {
      const value = form.get(key)
      if (value !== null) formData.append(key, String(value))
    })
    try {
      await dispatch(editEvent({ id, formData })).unwrap()
      toast.success('Event updated')
      setEditing(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update event')
    }
  }

  return (
    <section className="section-shell py-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Event dashboard</p>
          <h1 className="font-display text-4xl font-bold">My Events</h1>
          <p className="mt-2 text-sm text-charcoal-800/68 dark:text-ivory-100/68">
            Add, search, filter, view and manage your event plans with budget tracking.
          </p>
        </div>
        <Link to="/events/new">
          <Button icon={<CalendarPlus size={18} />}>Add Event</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total events" value={`${items.length}`} trend="Your saved plans" icon={<CalendarPlus size={20} />} />
        <StatCard label="Upcoming events" value={`${upcoming}`} trend="Future customer events" icon={<CalendarClock size={20} />} />
        <StatCard label="Total budget" value={formatLKR(totalBudget)} trend="Across your events" icon={<WalletCards size={20} />} />
        <StatCard label="Vendor requests" value={`${vendorRequests}`} trend="Your booking requests" icon={<Search size={20} />} />
      </div>

      <div className="mt-6 grid gap-3 rounded-lg bg-white p-4 shadow-soft dark:bg-charcoal-800 md:grid-cols-[1fr_220px_200px]">
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-gold-100 px-3 py-2 dark:border-white/10">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search by event name, venue or district"
          />
        </label>
        <select
          value={eventType}
          onChange={(event) => setEventType(event.target.value)}
          className="rounded-md border border-gold-100 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-charcoal-900"
          aria-label="Filter by event type"
        >
          {eventTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-md border border-gold-100 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-charcoal-900"
          aria-label="Filter by status"
        >
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && !loading ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-white p-10 text-center shadow-soft dark:bg-charcoal-800">
          <CalendarPlus className="mx-auto text-gold-700 dark:text-gold-300" size={36} />
          <h2 className="mt-4 text-2xl font-bold">No events found</h2>
          <p className="mt-2 text-sm text-charcoal-800/65 dark:text-ivory-100/65">Create your first event to start planning</p>
          <Link to="/events/new" className="mt-5 inline-flex">
            <Button icon={<CalendarPlus size={18} />}>Add Event</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-lg bg-white shadow-soft dark:bg-charcoal-800 lg:block">
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
                  {filtered.map((event) => (
                    <EventRow
                      key={event._id ?? event.id}
                      event={event}
                      onView={() => setViewing(event)}
                      onEdit={() => setEditing(event)}
                      onDelete={() => setDeleteTarget(event)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {loading && <p className="p-4 text-sm text-charcoal-800/60 dark:text-ivory-100/60">Loading latest events...</p>}
          </div>

          <div className="mt-6 grid gap-4 lg:hidden">
            {filtered.map((event) => (
              <article key={event._id ?? event.id} className="rounded-lg bg-white p-4 shadow-soft dark:bg-charcoal-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-bold">{event.eventTitle ?? event.title}</h2>
                    <p className="mt-1 text-sm text-charcoal-800/60 dark:text-ivory-100/60">
                      {event.eventType ?? event.type} • {formatEventDate(event)}
                    </p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
                <p className="mt-3 text-sm text-charcoal-800/70 dark:text-ivory-100/70">{event.venue}, {event.district}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="font-semibold">{formatLKR(event.budget)}</p>
                  <ActionButtons event={event} onView={() => setViewing(event)} onEdit={() => setEditing(event)} onDelete={() => setDeleteTarget(event)} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {viewing && <ViewModal event={viewing} onClose={() => setViewing(null)} />}
      {editing && <EditModal event={editing} onClose={() => setEditing(null)} onSubmit={handleEdit} />}
      {deleteTarget && <DeleteModal event={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={() => void confirmDelete()} />}
    </section>
  )
}

function EventRow({
  event,
  onView,
  onEdit,
  onDelete,
}: {
  event: EventPlan
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <tr className="border-t border-gold-100 transition hover:bg-ivory-100/70 dark:border-white/10 dark:hover:bg-white/5">
      <td className="p-4 font-semibold">{event.eventTitle ?? event.title}</td>
      <td>{event.eventType ?? event.type}</td>
      <td>{formatEventDate(event)}</td>
      <td>{event.venue}</td>
      <td>{formatLKR(event.budget)}</td>
      <td><StatusBadge status={event.status} /></td>
      <td className="p-4">
        <ActionButtons event={event} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  )
}

function ActionButtons({
  event,
  onView,
  onEdit,
  onDelete,
}: {
  event: EventPlan
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex justify-end gap-2">
      <IconButton label={`View ${event.eventTitle}`} onClick={onView}>
        <Eye size={16} />
      </IconButton>
      <IconButton label={`Edit ${event.eventTitle}`} onClick={onEdit}>
        <Pencil size={16} />
      </IconButton>
      <IconButton label={`Delete ${event.eventTitle}`} tone="danger" onClick={onDelete}>
        <Trash2 size={16} />
      </IconButton>
    </div>
  )
}

function IconButton({
  label,
  tone = 'default',
  children,
  onClick,
}: {
  label: string
  tone?: 'default' | 'danger'
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`group relative grid size-9 place-items-center rounded-md border transition hover:-translate-y-0.5 ${
        tone === 'danger'
          ? 'border-blush-300/30 text-blush-700 hover:bg-blush-50 dark:text-blush-300 dark:hover:bg-blush-700/20'
          : 'border-gold-100 text-charcoal-800/75 hover:bg-ivory-100 hover:text-gold-700 dark:border-white/10 dark:text-ivory-100/75 dark:hover:bg-white/10 dark:hover:text-gold-300'
      }`}
      onClick={onClick}
    >
      {children}
      <span className="pointer-events-none absolute bottom-full mb-2 hidden whitespace-nowrap rounded-md bg-charcoal-900 px-2 py-1 text-xs font-semibold text-ivory-50 shadow-soft group-hover:block">
        {label.split(' ')[0]}
      </span>
    </button>
  )
}

function StatusBadge({ status }: { status: EventPlan['status'] }) {
  const styles: Record<string, string> = {
    Planning: 'bg-gold-100 text-gold-700 dark:bg-gold-300/15 dark:text-gold-300',
    Confirmed: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-500',
    Completed: 'bg-charcoal-900 text-ivory-50 dark:bg-ivory-100 dark:text-charcoal-900',
    Cancelled: 'bg-blush-100 text-blush-700 dark:bg-blush-700/20 dark:text-blush-300',
  }
  return <span className={`rounded-md px-2 py-1 text-xs font-bold ${styles[status] ?? styles.Planning}`}>{status}</span>
}

function ViewModal({ event, onClose }: { event: EventPlan; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-charcoal-900 p-6 text-ivory-50 shadow-luxury">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gold-300">Event details</p>
            <h2 className="font-display text-3xl font-bold">{event.eventTitle}</h2>
          </div>
          <button type="button" className="grid size-10 place-items-center rounded-md hover:bg-white/10" onClick={onClose} aria-label="Close event details">
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Detail label="Date" value={formatEventDate(event)} />
          <Detail label="Status" value={event.status} />
          <Detail label="Type" value={event.eventType ?? event.type ?? ''} />
          <Detail label="Budget" value={formatLKR(event.budget)} />
          <Detail label="Venue" value={event.venue} />
          <Detail label="District" value={event.district} />
        </div>
        {event.description && <p className="mt-5 rounded-md bg-white/6 p-4 text-sm leading-6 text-ivory-100/75">{event.description}</p>}
      </div>
    </div>
  )
}

function EditModal({ event, onClose, onSubmit }: { event: EventPlan; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <form onSubmit={onSubmit} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-charcoal-900 p-6 text-ivory-50 shadow-luxury">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gold-300">Edit event</p>
            <h2 className="font-display text-3xl font-bold">{event.eventTitle}</h2>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>Close</Button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="eventTitle" defaultValue={event.eventTitle} className="field-dark" required />
          <select name="eventType" defaultValue={event.eventType} className="field-dark">{eventTypes.filter((type) => type !== 'All').map((type) => <option key={type}>{type}</option>)}</select>
          <input name="eventDate" type="date" defaultValue={formatInputDate(event)} className="field-dark" required />
          <input name="startTime" type="time" defaultValue={event.startTime ?? ''} className="field-dark" />
          <input name="endTime" type="time" defaultValue={event.endTime ?? ''} className="field-dark" />
          <input name="venue" defaultValue={event.venue} className="field-dark" required />
          <input name="district" defaultValue={event.district} className="field-dark" required />
          <input name="guestCount" type="number" defaultValue={event.guestCount} className="field-dark" />
          <input name="budget" type="number" defaultValue={event.budget} className="field-dark" />
          <select name="status" defaultValue={event.status} className="field-dark">
            {statuses.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}
          </select>
          <textarea name="description" defaultValue={event.description} rows={3} className="field-dark md:col-span-2" />
          <textarea name="notes" defaultValue={event.notes} rows={3} className="field-dark md:col-span-2" />
        </div>
        <Button className="mt-5 w-full">Save event changes</Button>
      </form>
    </div>
  )
}

function DeleteModal({ event, onCancel, onConfirm }: { event: EventPlan; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-charcoal-900 p-6 text-ivory-50 shadow-luxury">
        <h2 className="font-display text-2xl font-bold">Delete event</h2>
        <p className="mt-3 text-sm leading-6 text-ivory-100/70">Are you sure you want to delete this event?</p>
        <p className="mt-3 rounded-md bg-white/6 p-3 text-sm font-semibold">{event.eventTitle}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" className="border-white/10 bg-white/10 text-ivory-50" onClick={onCancel}>Cancel</Button>
          <Button type="button" className="bg-blush-700 text-white hover:bg-blush-500" onClick={onConfirm}>Delete Event</Button>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/6 p-4">
      <p className="text-xs font-semibold uppercase text-ivory-100/50">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  )
}

function formatEventDate(event: EventPlan) {
  const date = getEventDate(event)
  if (!date) return 'No date'
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function formatInputDate(event: EventPlan) {
  const date = getEventDate(event)
  return date ? date.toISOString().slice(0, 10) : ''
}

function getEventDate(event: EventPlan) {
  const raw = event.eventDate ?? event.date
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}
