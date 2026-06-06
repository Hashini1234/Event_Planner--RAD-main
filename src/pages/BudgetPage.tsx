import { AlertTriangle, Pencil, Plus, Trash2, WalletCards, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '../components/ui/Button'
import { loadEvents } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { createBudgetItem, deleteBudgetItem, fetchBudget, updateBudgetItem } from '../services/customerService'
import type { BudgetItem } from '../types/domain'
import { formatLKR } from '../utils/currency'

const categories = ['Venue', 'Catering', 'Decoration', 'Photography', 'Music', 'Makeup', 'Other']
const blankForm = { category: 'Venue', title: '', amount: '', notes: '' }

export function BudgetPage() {
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.events.items)
  const [eventId, setEventId] = useState('')
  const [items, setItems] = useState<BudgetItem[]>([])
  const [editing, setEditing] = useState<BudgetItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BudgetItem | null>(null)
  const [form, setForm] = useState(blankForm)
  const [summary, setSummary] = useState({
    budget: 0,
    totalSpent: 0,
    remaining: 0,
    warning: null as string | null,
    categories: [] as Array<{ category: string; amount: number }>,
  })

  useEffect(() => {
    dispatch(loadEvents({}))
  }, [dispatch])

  useEffect(() => {
    if (!eventId && events[0]) setEventId(events[0]._id ?? events[0].id)
  }, [eventId, events])

  const selectedEvent = events.find((event) => (event._id ?? event.id) === eventId)

  const loadBudget = async () => {
    if (!eventId) return
    try {
      const data = await fetchBudget(eventId)
      setItems(data.items)
      setSummary({
        budget: data.budget,
        totalSpent: data.totalSpent,
        remaining: data.remaining,
        warning: data.warning,
        categories: data.categories ?? [],
      })
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message
      toast.error(message ?? 'Could not load budget')
      setItems([])
      setSummary({ budget: selectedEvent?.budget ?? 0, totalSpent: 0, remaining: selectedEvent?.budget ?? 0, warning: null, categories: [] })
    }
  }

  useEffect(() => {
    void loadBudget()
  }, [eventId])

  const chartData = useMemo(
    () => categories.map((category) => ({ category, amount: summary.categories.find((item) => item.category === category)?.amount ?? 0 })).filter((item) => item.amount > 0),
    [summary.categories],
  )

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!eventId) {
      toast.error('Select an event first')
      return
    }
    const amount = Number(form.amount)
    if (!form.title.trim()) {
      toast.error('Expense title is required')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Expense amount must be greater than 0')
      return
    }

    try {
      const payload = {
        event: eventId,
        category: form.category,
        title: form.title.trim(),
        amount,
        plannedAmount: amount,
        actualAmount: amount,
        notes: form.notes.trim(),
      }
      if (editing) {
        await updateBudgetItem(editing._id ?? editing.id ?? '', payload)
        toast.success('Expense updated')
      } else {
        await createBudgetItem(payload)
        toast.success('Expense added')
      }
      setForm(blankForm)
      setEditing(null)
      await loadBudget()
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not save expense'
      toast.error(message)
    }
  }

  const startEdit = (item: BudgetItem) => {
    setEditing(item)
    setForm({
      category: item.category,
      title: item.title,
      amount: String(item.amount ?? item.actualAmount ?? item.plannedAmount ?? 0),
      notes: item.notes ?? '',
    })
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const id = deleteTarget._id ?? deleteTarget.id
    if (!id) return
    try {
      await deleteBudgetItem(id)
      toast.success('Expense deleted')
      setDeleteTarget(null)
      await loadBudget()
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not delete expense'
      toast.error(message)
    }
  }

  return (
    <section className="px-4 py-8 text-ivory-50 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-300">Budget intelligence</p>
          <h1 className="font-display text-4xl font-bold">Manage event expenses</h1>
          <p className="mt-2 max-w-2xl text-sm text-ivory-50/62">
            Track spending by event, review category totals, and keep your customer budget under control.
          </p>
        </div>
        <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="field-dark min-w-64">
          <option value="">Select event</option>
          {events.map((event) => <option key={event._id ?? event.id} value={event._id ?? event.id}>{event.eventTitle}</option>)}
        </select>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Summary label="Event Budget" value={formatLKR(summary.budget)} icon={<WalletCards />} />
        <Summary label="Total Spent" value={formatLKR(summary.totalSpent)} icon={<WalletCards />} />
        <Summary label="Remaining Budget" value={formatLKR(summary.remaining)} icon={<WalletCards />} warning={summary.warning} />
      </div>

      {summary.warning && (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-blush-300/30 bg-blush-700/20 p-4 text-blush-100">
          <AlertTriangle size={20} />
          <p className="font-semibold">{summary.warning}</p>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{editing ? 'Edit expense' : 'Add expense'}</h2>
            {editing && (
              <button type="button" className="grid size-9 place-items-center rounded-md hover:bg-white/10" onClick={() => { setEditing(null); setForm(blankForm) }} aria-label="Cancel edit">
                <X size={18} />
              </button>
            )}
          </div>
          <div className="mt-4 grid gap-4">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required className="field-dark" placeholder="Expense title" />
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="field-dark">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} type="number" min="1" step="0.01" required className="field-dark" placeholder="Amount" />
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} className="field-dark" placeholder="Notes" />
            <Button icon={<Plus size={18} />}>{editing ? 'Save changes' : 'Add expense'}</Button>
          </div>
        </form>

        <div className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <h2 className="text-xl font-bold">Expense categories</h2>
          {chartData.length === 0 ? (
            <div className="mt-4 grid h-72 place-items-center rounded-lg border border-dashed border-white/15 bg-white/4 text-center">
              <div>
                <WalletCards className="mx-auto text-gold-300" />
                <p className="mt-3 font-bold">No expense data yet</p>
                <p className="mt-1 text-sm text-ivory-50/58">Add an expense to see category spending.</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height={288} minWidth={0}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b332a" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                  <Tooltip formatter={(value) => formatLKR(Number(value))} />
                  <Bar dataKey="amount" fill="#c59b3b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-white/6 shadow-soft">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-xl font-bold">Expense history</h2>
        </div>
        {items.length === 0 ? (
          <p className="p-6 text-sm text-ivory-50/58">No expenses added for this event yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-ivory-50/58">
                <tr>
                  <th className="p-4">Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id ?? item.id} className="border-t border-white/10 transition hover:bg-white/5">
                    <td className="p-4 font-semibold">{item.title}</td>
                    <td>{item.category}</td>
                    <td>{formatLKR(item.amount ?? item.actualAmount ?? item.plannedAmount)}</td>
                    <td className="max-w-xs truncate text-ivory-50/68">{item.notes || '-'}</td>
                    <td>{formatDate(item)}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button className="grid size-9 place-items-center rounded-md border border-white/10 hover:bg-white/10" onClick={() => startEdit(item)} title="Edit expense" aria-label="Edit expense">
                          <Pencil size={16} />
                        </button>
                        <button className="grid size-9 place-items-center rounded-md border border-blush-300/30 text-blush-300 hover:bg-blush-700/20" onClick={() => setDeleteTarget(item)} title="Delete expense" aria-label="Delete expense">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-charcoal-900 p-6 shadow-luxury">
            <h2 className="font-display text-2xl font-bold">Delete expense</h2>
            <p className="mt-3 text-sm text-ivory-50/68">Are you sure you want to delete this expense?</p>
            <p className="mt-3 rounded-md bg-white/6 p-3 text-sm font-semibold">{deleteTarget.title}</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" className="border-white/10 bg-white/10 text-ivory-50" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button type="button" className="bg-blush-700 text-white hover:bg-blush-500" onClick={() => void confirmDelete()}>Delete Expense</Button>
            </div>
          </div>
        </div>
      )}
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

function formatDate(item: BudgetItem) {
  const raw = (item as BudgetItem & { createdAt?: string }).createdAt
  if (!raw) return '-'
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? '-' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
