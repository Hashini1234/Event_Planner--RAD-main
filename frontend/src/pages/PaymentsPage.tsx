import { CreditCard, ReceiptText, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { bookings } from '../utils/mockData'
import { formatLKR } from '../utils/currency'

export function PaymentsPage() {
  const totalDue = bookings.reduce((sum, booking) => sum + booking.amount, 0)

  return (
    <section className="section-shell py-8">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Payments</p>
          <h1 className="font-display text-4xl font-bold">Vendor deposits and event payments</h1>
        </div>
        <Button icon={<CreditCard size={18} />}>Make payment</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel rounded-lg p-5">
          <ReceiptText className="text-gold-700 dark:text-gold-300" />
          <p className="mt-4 text-sm text-charcoal-800/65 dark:text-ivory-100/65">Pending amount</p>
          <p className="mt-2 text-2xl font-bold">{formatLKR(totalDue)}</p>
        </div>
        <div className="glass-panel rounded-lg p-5">
          <ShieldCheck className="text-gold-700 dark:text-gold-300" />
          <p className="mt-4 text-sm text-charcoal-800/65 dark:text-ivory-100/65">Protected payments</p>
          <p className="mt-2 text-2xl font-bold">Escrow ready</p>
        </div>
        <div className="glass-panel rounded-lg p-5">
          <CreditCard className="text-gold-700 dark:text-gold-300" />
          <p className="mt-4 text-sm text-charcoal-800/65 dark:text-ivory-100/65">Payment method</p>
          <p className="mt-2 text-2xl font-bold">Card / Bank</p>
        </div>
      </div>

      <div className="mt-6 glass-panel rounded-lg p-6">
        <h2 className="text-xl font-bold">Payment requests</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-charcoal-800/60 dark:text-ivory-100/60">
              <tr>
                <th className="py-3">Vendor</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-gold-100 dark:border-white/10">
                  <td className="py-3 font-medium">{booking.vendorName}</td>
                  <td>{booking.eventTitle}</td>
                  <td>{formatLKR(booking.amount)}</td>
                  <td className="capitalize">{booking.status}</td>
                  <td>
                    <Button variant="secondary" className="min-h-9 px-3 py-1">
                      Pay
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
