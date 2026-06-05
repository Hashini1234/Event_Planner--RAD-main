import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { loadEvents } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { createGuest, deleteGuest, fetchGuests, updateGuest } from '../services/customerService'
import type { Guest } from '../types/domain'
import { guests as demoGuests } from '../utils/mockData'

const blankGuest: Omit<Guest, 'id' | 'checkedIn'> = { name: '', email: '', phone: '', group: 'Family', rsvp: 'pending', plusOnes: 0 }

export function GuestsPage() {
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.events.items)
  const [eventId, setEventId] = useState('')
  const [guests, setGuests] = useState<Guest[]>(demoGuests)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blankGuest)

  useEffect(() => {
    dispatch(loadEvents({}))
  }, [dispatch])

  useEffect(() => {
    if (!eventId && events[0]) setEventId(events[0]._id ?? events[0].id)
  }, [eventId, events])

  const load = async () => {
    if (!eventId) return
    try {
      const data = await fetchGuests(eventId)
      setGuests(data.length ? data : demoGuests)
    } catch {
      setGuests(demoGuests)
    }
  }

  useEffect(() => {
    void load()
  }, [eventId])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!eventId) {
      toast.error('Select an event first')
      return
    }
    try {
      if (editingId) {
        await updateGuest(editingId, form)
        toast.success('Guest updated')
      } else {
        await createGuest({ ...form, event: eventId })
        toast.success('Guest added')
      }
      setForm(blankGuest)
      setEditingId(null)
      await load()
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not save guest'
      toast.error(message)
    }
  }

  const remove = async (guest: Guest) => {
    const id = guest._id ?? guest.id
    if (!id || id.startsWith('g')) {
      toast.error('Demo guest cannot be deleted until saved in MongoDB')
      return
    }
    try {
      await deleteGuest(id)
      toast.success('Guest deleted')
      await load()
    } catch {
      toast.error('Could not delete guest')
    }
  }

  return (
    <section className="px-4 py-8 text-ivory-50 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-300">Guest management</p>
          <h1 className="font-display text-4xl font-bold">RSVP and guest list</h1>
          <p className="mt-2 text-sm text-ivory-50/62">Add guests, update RSVP status, and manage invitations per event.</p>
        </div>
        <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="field-dark min-w-64">
          <option value="">Select event</option>
          {events.map((event) => <option key={event._id ?? event.id} value={event._id ?? event.id}>{event.eventTitle}</option>)}
        </select>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <h2 className="text-xl font-bold">{editingId ? 'Edit guest' : 'Add guest'}</h2>
          <div className="mt-4 grid gap-4">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required className="field-dark" placeholder="Guest name" />
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="field-dark" placeholder="Email" />
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="field-dark" placeholder="Phone" />
            <input value={form.group} onChange={(event) => setForm({ ...form, group: event.target.value })} className="field-dark" placeholder="Group" />
            <select value={form.rsvp} onChange={(event) => setForm({ ...form, rsvp: event.target.value as Guest['rsvp'] })} className="field-dark">
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
            <Button icon={<Plus size={18} />}>{editingId ? 'Save changes' : 'Add guest'}</Button>
          </div>
        </form>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/6 shadow-soft">
          <div className="grid gap-4 border-b border-white/10 p-5 sm:grid-cols-3">
            <RsvpCard label="Pending" value={guests.filter((guest) => guest.rsvp === 'pending').length} />
            <RsvpCard label="Accepted" value={guests.filter((guest) => guest.rsvp === 'accepted').length} />
            <RsvpCard label="Declined" value={guests.filter((guest) => guest.rsvp === 'declined').length} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-ivory-50/58">
                <tr>
                  <th className="p-4">Guest</th>
                  <th>Phone</th>
                  <th>Group</th>
                  <th>RSVP</th>
                  <th>Check-in</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest._id ?? guest.id} className="border-t border-white/10">
                    <td className="p-4">
                      <p className="font-semibold">{guest.name}</p>
                      <p className="text-ivory-50/58">{guest.email}</p>
                    </td>
                    <td>{guest.phone}</td>
                    <td>{guest.group}</td>
                    <td className="capitalize">
                      <span className="rounded-md bg-gold-300/14 px-2 py-1 text-xs font-bold text-gold-300">{guest.rsvp}</span>
                    </td>
                    <td>{guest.checkedIn ? 'Checked in' : 'Waiting'}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button className="grid h-9 w-9 place-items-center rounded-md hover:bg-white/10" onClick={() => { setEditingId(guest._id ?? guest.id); setForm({ name: guest.name, email: guest.email, phone: guest.phone, group: guest.group, rsvp: guest.rsvp, plusOnes: guest.plusOnes ?? 0 }) }}>
                          <Pencil size={16} />
                        </button>
                        <button className="grid h-9 w-9 place-items-center rounded-md text-blush-300 hover:bg-white/10" onClick={() => void remove(guest)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function RsvpCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white/6 p-4">
      <Users className="text-gold-300" size={20} />
      <p className="mt-2 text-sm text-ivory-50/62">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
