import { Bell, CalendarX, CreditCard, ReceiptText, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { cancelBooking, fetchMyBookings, fetchNotifications, markNotificationRead } from '../services/customerService'
import type { Booking, NotificationItem } from '../types/domain'
import { formatLKR } from '../utils/currency'
import { bookings as demoBookings } from '../utils/mockData'

function bookingId(booking: Booking) {
  return booking._id ?? booking.id
}

function bookingVendor(booking: Booking) {
  return booking.vendor?.vendorName ?? booking.vendor?.businessName ?? booking.vendorName
}

function bookingEvent(booking: Booking) {
  return booking.event?.eventTitle ?? booking.eventTitle
}

export function PaymentsPage() {
  const [bookings, setBookings] = useState<Booking[]>(demoBookings)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const load = async () => {
    try {
      const [bookingData, notificationData] = await Promise.all([fetchMyBookings(), fetchNotifications()])
      setBookings(bookingData.length ? bookingData : demoBookings)
      setNotifications(notificationData)
    } catch {
      setBookings(demoBookings)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const pendingAmount = useMemo(
    () => bookings.filter((booking) => booking.status === 'pending' || booking.status === 'accepted').reduce((sum, booking) => sum + Number(booking.amount), 0),
    [bookings],
  )

  const handleCancel = async (booking: Booking) => {
    const id = bookingId(booking)
    if (!id || id.startsWith('b')) {
      toast.error('Demo booking cannot be cancelled until it is saved in MongoDB')
      return
    }
    try {
      await cancelBooking(id)
      toast.success('Pending booking cancelled')
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
          <p className="text-sm font-semibold text-gold-300">Bookings & notifications</p>
          <h1 className="font-display text-4xl font-bold">My vendor bookings</h1>
          <p className="mt-2 text-sm text-ivory-50/62">Track booking requests, cancel pending bookings, and view customer notifications.</p>
        </div>
        <Button icon={<CreditCard size={18} />}>Payment center</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={<ReceiptText />} label="Pending amount" value={formatLKR(pendingAmount)} />
        <SummaryCard icon={<ShieldCheck />} label="Active bookings" value={`${bookings.filter((item) => item.status !== 'cancelled').length}`} />
        <SummaryCard icon={<Bell />} label="Unread notifications" value={`${notifications.filter((item) => !item.readAt).length}`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <h2 className="text-xl font-bold">My bookings</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="text-ivory-50/58">
                <tr>
                  <th className="py-3">Vendor</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={bookingId(booking)} className="border-t border-white/10">
                    <td className="py-3 font-medium">{bookingVendor(booking)}</td>
                    <td>{bookingEvent(booking)}</td>
                    <td>{String(booking.date).slice(0, 10)}</td>
                    <td>{formatLKR(booking.amount)}</td>
                    <td className="capitalize">
                      <span className="rounded-md bg-gold-300/14 px-2 py-1 text-xs font-bold text-gold-300">{booking.status}</span>
                    </td>
                    <td className="text-right">
                      <Button
                        variant="secondary"
                        className="min-h-9 border-white/10 bg-white/8 px-3 py-1 text-ivory-50"
                        disabled={booking.status !== 'pending'}
                        icon={<CalendarX size={15} />}
                        onClick={() => void handleCancel(booking)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-white/6 p-6 shadow-soft">
          <h2 className="text-xl font-bold">Notifications</h2>
          <div className="mt-4 grid gap-3">
            {notifications.length === 0 && <p className="text-sm text-ivory-50/58">No notifications yet.</p>}
            {notifications.map((item) => (
              <button
                key={item._id ?? item.id}
                onClick={() => void handleRead(item)}
                className={`rounded-md border p-4 text-left transition ${
                  item.readAt ? 'border-white/8 bg-white/4 text-ivory-50/58' : 'border-gold-300/30 bg-gold-300/10'
                }`}
              >
                <p className="font-bold">{item.title}</p>
                <p className="mt-1 text-sm leading-6">{item.message}</p>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/6 p-5 shadow-soft">
      <span className="text-gold-300">{icon}</span>
      <p className="mt-4 text-sm text-ivory-50/62">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}
