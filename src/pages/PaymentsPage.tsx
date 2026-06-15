import { Bell, CalendarX, CreditCard, MessageSquare, ReceiptText, ShieldCheck, Star, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { cancelBooking, createVendorReview, fetchMyBookings, fetchNotifications, markNotificationRead } from '../services/customerService'
import type { Booking, NotificationItem } from '../types/domain'
import { formatLKR } from '../utils/currency'

export function PaymentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const [bookingData, notificationData] = await Promise.all([fetchMyBookings(), fetchNotifications()])
      setBookings(bookingData)
      setNotifications(notificationData)
    } catch {
      toast.error('Could not load your bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const pendingAmount = useMemo(
    () => bookings.filter((booking) => ['pending', 'accepted'].includes(booking.status)).reduce((sum, booking) => sum + bookingAmount(booking), 0),
    [bookings],
  )

  const handleCancel = async () => {
    if (!cancelTarget) return
    const id = bookingId(cancelTarget)
    if (!id) return
    try {
      await cancelBooking(id)
      toast.success('Pending booking cancelled')
      setCancelTarget(null)
      await load()
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not cancel booking'
      toast.error(message)
    }
  }

  const handleRead = async (item: NotificationItem) => {
    const id = item._id ?? item.id
    if (!id) return
    try {
      await markNotificationRead(id)
      setNotifications((current) => current.map((notification) => ((notification._id ?? notification.id) === id ? { ...notification, readAt: new Date().toISOString() } : notification)))
    } catch {
      toast.error('Could not update notification')
    }
  }

  return (
    <section className="px-4 py-8 text-ivory-50 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-300">My Vendor Bookings</p>
          <h1 className="font-display text-4xl font-bold">Track vendor booking requests</h1>
          <p className="mt-2 text-sm text-ivory-50/62">Review package requests, booking statuses, cancellation options, and post-event reviews.</p>
        </div>
        <Button icon={<CreditCard size={18} />}>Payment center</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={<ReceiptText />} label="Pending amount" value={formatLKR(pendingAmount)} />
        <SummaryCard icon={<ShieldCheck />} label="Active bookings" value={`${bookings.filter((item) => item.status !== 'cancelled').length}`} />
        <SummaryCard icon={<Bell />} label="Unread notifications" value={`${notifications.filter((item) => !item.readAt).length}`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <h2 className="text-xl font-bold">My bookings</h2>
          {loading ? (
            <div className="mt-4 rounded-md bg-white/6 p-6 text-center text-sm text-ivory-50/58">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="mt-4 rounded-md border border-white/10 bg-charcoal-900/60 p-8 text-center">
              <CalendarX className="mx-auto text-gold-300" size={34} />
              <h3 className="mt-3 text-xl font-bold">No vendor bookings yet</h3>
              <p className="mt-2 text-sm text-ivory-50/58">Book a vendor from the marketplace to start tracking requests here.</p>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="text-ivory-50/58">
                  <tr>
                    <th className="py-3">Vendor Name</th>
                    <th>Event Name</th>
                    <th>Package</th>
                    <th>Price</th>
                    <th>Event Date</th>
                    <th>Booking Date</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={bookingId(booking)} className="border-t border-white/10 align-middle">
                      <td className="py-3 font-medium">{bookingVendor(booking)}</td>
                      <td>{bookingEvent(booking)}</td>
                      <td>{booking.packageName ?? booking.packageTitle ?? 'Standard package'}</td>
                      <td>{formatLKR(bookingAmount(booking))}</td>
                      <td>{formatDate(booking.eventDate ?? booking.date)}</td>
                      <td>{formatDate(booking.createdAt)}</td>
                      <td><StatusBadge status={booking.status} /></td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" className="min-h-9 border-white/10 bg-white/8 px-3 py-1 text-ivory-50" disabled={booking.status !== 'pending'} icon={<CalendarX size={15} />} onClick={() => setCancelTarget(booking)}>
                            Cancel
                          </Button>
                          <Button variant="secondary" className="min-h-9 border-white/10 bg-white/8 px-3 py-1 text-ivory-50" disabled={booking.status !== 'completed'} icon={<MessageSquare size={15} />} onClick={() => setReviewTarget(booking)}>
                            Review
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <h2 className="text-xl font-bold">Notifications</h2>
          <div className="mt-4 grid gap-3">
            {notifications.length === 0 && <p className="text-sm text-ivory-50/58">No notifications yet.</p>}
            {notifications.map((item) => (
              <button key={item._id ?? item.id} onClick={() => void handleRead(item)} className={`rounded-md border p-4 text-left transition ${item.readAt ? 'border-white/8 bg-white/4 text-ivory-50/58' : 'border-gold-300/30 bg-gold-300/10'}`}>
                <p className="font-bold">{item.title}</p>
                <p className="mt-1 text-sm leading-6">{item.message}</p>
              </button>
            ))}
          </div>
        </aside>
      </div>

      {cancelTarget && (
        <ConfirmModal
          title="Cancel booking request?"
          message="Only pending bookings can be cancelled. This action will notify your planning workspace."
          confirmLabel="Cancel Booking"
          onCancel={() => setCancelTarget(null)}
          onConfirm={() => void handleCancel()}
        />
      )}
      {reviewTarget && <ReviewModal booking={reviewTarget} onClose={() => setReviewTarget(null)} onSaved={async () => { setReviewTarget(null); await load() }} />}
    </section>
  )
}

function ReviewModal({ booking, onClose, onSaved }: { booking: Booking; onClose: () => void; onSaved: () => void }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const id = bookingId(booking)
    if (!id) return
    try {
      await createVendorReview({ bookingId: id, rating, comment })
      toast.success('Review submitted')
      onSaved()
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not submit review'
      toast.error(message)
    }
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <form onSubmit={submit} className="w-full max-w-xl rounded-lg border border-white/10 bg-charcoal-900 p-6 shadow-luxury">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gold-300">Post event review</p>
            <h2 className="font-display text-3xl font-bold">{bookingVendor(booking)}</h2>
          </div>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <label className="mt-5 grid gap-2 text-sm font-medium text-ivory-50/76">
          Rating
          <select value={rating} onChange={(item) => setRating(Number(item.target.value))} className="field-dark">
            {[5, 4, 3, 2, 1].map((item) => <option key={item} value={item}>{item} Stars</option>)}
          </select>
        </label>
        <textarea value={comment} onChange={(item) => setComment(item.target.value)} rows={4} className="field-dark mt-4" placeholder="Share your experience with this vendor" />
        <Button className="mt-5 w-full" icon={<Star size={18} />}>Submit Review</Button>
      </form>
    </div>
  )
}

function ConfirmModal({ title, message, confirmLabel, onCancel, onConfirm }: { title: string; message: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-charcoal-900 p-6 shadow-luxury">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-ivory-50/62">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" className="border-white/10 bg-white/8 text-ivory-50" onClick={onCancel}>Keep Booking</Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/6 p-5 shadow-soft"><span className="text-gold-300">{icon}</span><p className="mt-4 text-sm text-ivory-50/62">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const styles: Record<string, string> = {
    pending: 'bg-gold-300/14 text-gold-300',
    accepted: 'bg-emerald-400/14 text-emerald-200',
    rejected: 'bg-blush-700/18 text-blush-200',
    cancelled: 'bg-white/10 text-ivory-50/58',
    completed: 'bg-sky-400/14 text-sky-200',
    paid: 'bg-emerald-400/14 text-emerald-200',
    refunded: 'bg-white/10 text-ivory-50/58',
  }
  return <span className={`rounded-md px-2 py-1 text-xs font-bold capitalize ${styles[status] ?? styles.pending}`}>{status}</span>
}

function bookingId(booking: Booking) { return booking._id ?? booking.id }
function bookingVendor(booking: Booking) {
  const vendor = booking.vendor ?? (typeof booking.vendorId === 'object' ? booking.vendorId : undefined)
  return vendor?.vendorName ?? vendor?.businessName ?? booking.vendorName ?? 'Vendor'
}
function bookingEvent(booking: Booking) {
  const event = booking.event ?? (typeof booking.eventId === 'object' ? booking.eventId : undefined)
  return event?.eventTitle ?? booking.eventTitle ?? 'Event'
}
function bookingAmount(booking: Booking) { return Number(booking.packagePrice ?? booking.amount ?? 0) }
function formatDate(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
