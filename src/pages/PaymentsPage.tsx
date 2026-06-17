import { Bell, CalendarX, CreditCard, MessageSquare, ReceiptText, ShieldCheck, Star, Store, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { cancelBooking, createPaymentIntent, createVendorReview, fetchMyBookings, fetchNotifications, markNotificationRead } from '../services/customerService'
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

  const handlePayment = async (booking: Booking) => {
    const id = bookingId(booking)
    if (!id || booking.status !== 'accepted') return
    try {
      await createPaymentIntent({
        bookingId: id,
        vendor: bookingVendorId(booking),
        amount: bookingAmount(booking),
      })
      toast.success('Payment started for confirmed booking')
      await load()
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not start payment'
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
    <section className="px-4 py-5 text-[#171124] sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <div className="rounded-2xl border border-[#ece6f5] bg-white p-6 shadow-[0_12px_35px_rgba(31,17,50,0.07)] lg:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#7c3aed]">My Vendor Bookings</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Track vendor booking requests</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b6078]">
                Review booking status, cancel pending requests, pay after admin confirmation, and submit post-event reviews.
              </p>
            </div>
            <Link to="/vendors">
              <Button icon={<Store size={18} />} className="rounded-lg bg-[#6d28d9] px-5 text-white hover:bg-[#5b21b6]">
                Find Vendors
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard icon={<ReceiptText />} label="Pending amount" value={formatLKR(pendingAmount)} tone="purple" />
          <SummaryCard icon={<ShieldCheck />} label="Active bookings" value={`${bookings.filter((item) => item.status !== 'cancelled').length}`} tone="green" />
          <SummaryCard icon={<Bell />} label="Unread notifications" value={`${notifications.filter((item) => !item.readAt).length}`} tone="gold" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-[#ece6f5] bg-white p-6 shadow-[0_12px_35px_rgba(31,17,50,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">My bookings</h2>
                <p className="mt-1 text-sm text-[#6b6078]">Only your vendor booking requests are shown here.</p>
              </div>
              <CreditCard className="text-[#7c3aed]" size={24} />
            </div>

            {loading ? (
              <div className="mt-5 rounded-xl bg-[#faf8ff] p-8 text-center text-sm font-semibold text-[#6b6078]">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="mt-5 rounded-xl border border-[#ece6f5] bg-[#faf8ff] p-10 text-center">
                <CalendarX className="mx-auto text-[#7c3aed]" size={38} />
                <h3 className="mt-3 text-xl font-bold">No vendor bookings yet</h3>
                <p className="mt-2 text-sm text-[#6b6078]">Book a vendor from the marketplace to start tracking requests here.</p>
                <Link to="/vendors" className="mt-5 inline-flex">
                  <Button icon={<Store size={17} />} className="rounded-lg bg-[#6d28d9] text-white hover:bg-[#5b21b6]">
                    Browse Vendors
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-[#faf8ff] text-xs uppercase tracking-wide text-[#6b6078]">
                    <tr>
                      <th className="rounded-l-xl px-4 py-3">Vendor Name</th>
                      <th className="px-4 py-3">Event Name</th>
                      <th className="px-4 py-3">Package</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Event Date</th>
                      <th className="px-4 py-3">Booking Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="rounded-r-xl px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={bookingId(booking)} className="border-b border-[#f0ebf6] align-middle last:border-b-0">
                        <td className="px-4 py-4 font-bold text-[#171124]">{bookingVendor(booking)}</td>
                        <td className="px-4 py-4 text-[#4b3a5d]">{bookingEvent(booking)}</td>
                        <td className="px-4 py-4 text-[#4b3a5d]">{booking.packageName ?? booking.packageTitle ?? 'Standard package'}</td>
                        <td className="px-4 py-4 font-bold">{formatLKR(bookingAmount(booking))}</td>
                        <td className="px-4 py-4 text-[#4b3a5d]">{formatDate(booking.eventDate ?? booking.date)}</td>
                        <td className="px-4 py-4 text-[#4b3a5d]">{formatDate(booking.createdAt)}</td>
                        <td className="px-4 py-4"><StatusBadge status={booking.status} /></td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="secondary" className="min-h-9 rounded-lg border-[#e7dff0] bg-white px-3 py-1 text-[#4b3a5d]" disabled={booking.status !== 'pending'} icon={<CalendarX size={15} />} onClick={() => setCancelTarget(booking)}>
                              Cancel
                            </Button>
                            <Button className="min-h-9 rounded-lg bg-[#6d28d9] px-3 py-1 text-white hover:bg-[#5b21b6]" disabled={booking.status !== 'accepted'} icon={<CreditCard size={15} />} onClick={() => void handlePayment(booking)}>
                              Pay
                            </Button>
                            <Button variant="secondary" className="min-h-9 rounded-lg border-[#e7dff0] bg-white px-3 py-1 text-[#4b3a5d]" disabled={booking.status !== 'completed'} icon={<MessageSquare size={15} />} onClick={() => setReviewTarget(booking)}>
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

          <aside className="rounded-2xl border border-[#ece6f5] bg-white p-6 shadow-[0_12px_35px_rgba(31,17,50,0.06)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Notifications</h2>
              <Bell className="text-[#7c3aed]" size={22} />
            </div>
            <div className="mt-5 grid gap-3">
              {notifications.length === 0 && (
                <div className="rounded-xl bg-[#faf8ff] p-5 text-sm font-medium text-[#6b6078]">No notifications yet.</div>
              )}
              {notifications.map((item) => (
                <button
                  key={item._id ?? item.id}
                  onClick={() => void handleRead(item)}
                  className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    item.readAt
                      ? 'border-[#ece6f5] bg-white text-[#6b6078]'
                      : 'border-[#d8c4ff] bg-[#faf8ff] text-[#171124] shadow-sm'
                  }`}
                >
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 text-sm leading-6">{item.message}</p>
                </button>
              ))}
            </div>
          </aside>
        </div>
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#171124]/70 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-xl rounded-2xl bg-white p-6 text-[#171124] shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#7c3aed]">Post event review</p>
            <h2 className="mt-1 text-3xl font-bold">{bookingVendor(booking)}</h2>
          </div>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-xl hover:bg-[#faf8ff]" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <label className="mt-5 grid gap-2 text-sm font-semibold text-[#554a63]">
          Rating
          <select value={rating} onChange={(item) => setRating(Number(item.target.value))} className="market-field">
            {[5, 4, 3, 2, 1].map((item) => <option key={item} value={item}>{item} Stars</option>)}
          </select>
        </label>
        <textarea value={comment} onChange={(item) => setComment(item.target.value)} rows={4} className="market-field mt-4 min-h-28" placeholder="Share your experience with this vendor" />
        <Button className="mt-5 w-full rounded-lg bg-[#6d28d9] text-white hover:bg-[#5b21b6]" icon={<Star size={18} />}>Submit Review</Button>
      </form>
    </div>
  )
}

function ConfirmModal({ title, message, confirmLabel, onCancel, onConfirm }: { title: string; message: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#171124]/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-[#171124] shadow-2xl">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#6b6078]">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" className="rounded-lg border-[#e7dff0] bg-white text-[#4b3a5d]" onClick={onCancel}>Keep Booking</Button>
          <Button className="rounded-lg bg-[#6d28d9] text-white hover:bg-[#5b21b6]" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: 'purple' | 'green' | 'gold' }) {
  const styles = {
    purple: 'bg-[#f1e7ff] text-[#6d28d9]',
    green: 'bg-[#dcfce7] text-[#15803d]',
    gold: 'bg-[#fff7df] text-[#b45309]',
  }
  return (
    <div className="rounded-2xl border border-[#ece6f5] bg-white p-5 shadow-[0_12px_35px_rgba(31,17,50,0.06)]">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${styles[tone]}`}>{icon}</span>
      <p className="mt-4 text-sm font-semibold text-[#6b6078]">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const styles: Record<string, string> = {
    pending: 'bg-[#fff7df] text-[#b45309]',
    accepted: 'bg-[#dcfce7] text-[#15803d]',
    rejected: 'bg-[#ffe4e6] text-[#be123c]',
    cancelled: 'bg-[#f1f5f9] text-[#64748b]',
    completed: 'bg-[#dbeafe] text-[#1d4ed8]',
    paid: 'bg-[#dcfce7] text-[#15803d]',
    refunded: 'bg-[#f1f5f9] text-[#64748b]',
  }
  return <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status] ?? styles.pending}`}>{status}</span>
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
function bookingVendorId(booking: Booking) {
  if (typeof booking.vendorId === 'string') return booking.vendorId
  if (booking.vendorId && typeof booking.vendorId === 'object') return booking.vendorId._id ?? booking.vendorId.id
  return typeof booking.vendor === 'object' ? booking.vendor._id ?? booking.vendor.id : undefined
}
function formatDate(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
