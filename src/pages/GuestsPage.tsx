import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '../components/ui/Button'
import { guests } from '../utils/mockData'

export function GuestsPage() {
  return (
    <section className="section-shell py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Guest management</p>
          <h1 className="font-display text-4xl font-bold">RSVP, QR invites and check-in</h1>
        </div>
        <Button>Bulk upload CSV</Button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="glass-panel overflow-hidden rounded-lg">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-white/65 text-charcoal-800/60 dark:bg-white/5 dark:text-ivory-100/60">
              <tr>
                <th className="p-4">Guest</th>
                <th>Phone</th>
                <th>Group</th>
                <th>RSVP</th>
                <th>Check-in</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} className="border-t border-gold-100 dark:border-white/10">
                  <td className="p-4">
                    <p className="font-semibold">{guest.name}</p>
                    <p className="text-charcoal-800/60 dark:text-ivory-100/60">{guest.email}</p>
                  </td>
                  <td>{guest.phone}</td>
                  <td>{guest.group}</td>
                  <td className="capitalize">{guest.rsvp}</td>
                  <td>{guest.checkedIn ? 'Checked in' : 'Waiting'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="glass-panel rounded-lg p-6">
          <h2 className="text-xl font-bold">Invitation QR</h2>
          <div className="mt-5 rounded-lg bg-white p-5">
            <QRCodeCanvas value="https://celebratelk.lk/rsvp/e1/g1" size={220} />
          </div>
          <p className="mt-4 text-sm text-charcoal-800/65 dark:text-ivory-100/65">
            Scan for secure RSVP and event-day check-in.
          </p>
        </aside>
      </div>
    </section>
  )
}
