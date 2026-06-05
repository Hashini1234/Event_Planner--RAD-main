import { AlertTriangle, Pencil, Plus, Trash2, WalletCards } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '../components/ui/Button'
import { loadEvents } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { createBudgetItem, deleteBudgetItem, fetchBudget, updateBudgetItem } from '../services/customerService'
import type { BudgetItem } from '../types/domain'
import { formatLKR } from '../utils/currency'

const blankItem = { category: 'Venue', title: '', plannedAmount: 0, actualAmount: 0, notes: '', paid: false }

export function BudgetPage() {
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.events.items)
  const [eventId, setEventId] = useState('')
  const [items, setItems] = useState<BudgetItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blankItem)
  const [summary, setSummary] = useState({ budget: 0, totalSpent: 0, remaining: 0, warning: null as string | null })

  useEffect(() => {
    dispatch(loadEvents({}))
  }, [dispatch])

  useEffect(() => {
    if (!eventId && events[0]) setEventId(events[0]._id ?? events[0].id)
  }, [eventId, events])

  const load = async () => {
    if (!eventId) return
    try {
      const data = await fetchBudget(eventId)
      setItems(data.items)
      setSummary({ budget: data.budget, totalSpent: data.totalSpent, remaining: data.remaining, warning: data.warning })
    } catch {
      setItems([])
      const event = events.find((item) => (item._id ?? item.id) === eventId)
      setSummary({ budget: event?.budget ?? 0, totalSpent: 0, remaining: event?.budget ?? 0, warning: null })
    }
  }

  useEffect(() => {
    void load()
  }, [eventId])

  const chartData = useMemo(
    () => items.map((item) => ({ name: item.category, value: Number(item.actualAmount || item.plannedAmount || 0) })),
    [items],
  )

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!eventId) {
      toast.error('Create or select an event first')
      return
    }
    try {
      if (editingId) {
        await updateBudgetItem(editingId, form)
        toast.success('Expense updated')
      } else {
        await createBudgetItem({ ...form, event: eventId })
        toast.success('Expense added')
      }
      setForm(blankItem)
      setEditingId(null)
      await load()
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not save expense'
      toast.error(message)
    }
  }

  const remove = async (item: BudgetItem) => {
    const id = item._id ?? item.id
    if (!id) return
    try {
      await deleteBudgetItem(id)
      toast.success('Expense deleted')
      await load()
    } catch {
      toast.error('Could not delete expense')
    }
  }

  return (
    <section className="px-4 py-8 text-ivory-50 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-300">Budget intelligence</p>
          <h1 className="font-display text-4xl font-bold">Expenses, categories and warnings</h1>
        </div>
        <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="field-dark min-w-64">
          <option value="">Select event</option>
          {events.map((event) => <option key={event._id ?? event.id} value={event._id ?? event.id}>{event.eventTitle}</option>)}
        </select>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Summary label="Event budget" value={formatLKR(summary.budget)} icon={<WalletCards />} />
        <Summary label="Total spent" value={formatLKR(summary.totalSpent)} icon={<WalletCards />} />
        <Summary label="Remaining" value={formatLKR(summary.remaining)} icon={<WalletCards />} warning={summary.warning} />
      </div>

      {summary.warning && (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-blush-300/30 bg-blush-700/20 p-4 text-blush-100">
          <AlertTriangle size={20} />
          <p className="font-semibold">{summary.warning}</p>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <h2 className="text-xl font-bold">{editingId ? 'Edit expense' : 'Add expense'}</h2>
          <div className="mt-4 grid gap-4">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required className="field-dark" placeholder="Expense title" />
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="field-dark">
              {['Venue', 'Catering', 'Decoration', 'Photography', 'Music', 'Transport', 'Other'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <input value={form.plannedAmount} onChange={(event) => setForm({ ...form, plannedAmount: Number(event.target.value) })} type="number" className="field-dark" placeholder="Planned amount" />
            <input value={form.actualAmount} onChange={(event) => setForm({ ...form, actualAmount: Number(event.target.value) })} type="number" className="field-dark" placeholder="Actual amount" />
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} className="field-dark" placeholder="Notes" />
            <Button icon={<Plus size={18} />}>{editingId ? 'Save changes' : 'Add expense'}</Button>
          </div>
        </form>

        <div className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <h2 className="text-xl font-bold">Expense categories</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height={288} minWidth={0}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b332a" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatLKR(Number(value))} />
                <Bar dataKey="value" fill="#c59b3b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-white/6 shadow-soft">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-ivory-50/58">
            <tr>
              <th className="p-4">Expense</th>
              <th>Category</th>
              <th>Planned</th>
              <th>Actual</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id ?? item.id} className="border-t border-white/10">
                <td className="p-4 font-semibold">{item.title}</td>
                <td>{item.category}</td>
                <td>{formatLKR(item.plannedAmount)}</td>
                <td>{formatLKR(item.actualAmount)}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button className="grid h-9 w-9 place-items-center rounded-md hover:bg-white/10" onClick={() => { setEditingId(item._id ?? item.id ?? null); setForm({ category: item.category, title: item.title, plannedAmount: item.plannedAmount, actualAmount: item.actualAmount, notes: item.notes ?? '', paid: item.paid ?? false }) }}>
                      <Pencil size={16} />
                    </button>
                    <button className="grid h-9 w-9 place-items-center rounded-md text-blush-300 hover:bg-white/10" onClick={() => void remove(item)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Summary({ label, value, icon, warning }: { label: string; value: string; icon: ReactNode; warning?: string | null }) {
  return (
    <div className={`rounded-lg border p-5 shadow-soft ${warning ? 'border-blush-300/40 bg-blush-700/18' : 'border-white/10 bg-white/6'}`}>
      <span className="text-gold-300">{icon}</span>
      <p className="mt-4 text-sm text-ivory-50/62">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}
