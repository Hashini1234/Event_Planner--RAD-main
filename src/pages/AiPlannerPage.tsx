import { WandSparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function AiPlannerPage() {
  return (
    <section className="section-shell py-8">
      <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">OpenAI assistant</p>
      <h1 className="font-display text-4xl font-bold">Smart checklist, seating and vendor matching</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="glass-panel rounded-lg p-6">
          <label className="grid gap-2 text-sm font-medium">
            Planning prompt
            <textarea
              rows={9}
              className="rounded-md border border-gold-100 bg-white p-3 outline-none focus:border-gold-500 dark:border-white/10 dark:bg-charcoal-800"
              defaultValue="Plan a premium Kandyan wedding for 250 guests with a LKR 5.2M budget and outdoor photo session."
            />
          </label>
          <Button className="mt-4" icon={<WandSparkles size={18} />}>Generate recommendations</Button>
        </form>
        <div className="glass-panel rounded-lg p-6">
          <h2 className="text-xl font-bold">Generated plan preview</h2>
          <div className="mt-4 grid gap-3">
            {[
              'Shortlist 3 verified halls in Colombo/Kandy with covered rain plan.',
              'Allocate 28% catering, 22% venue, 12% decor, 8% photography, 5% music.',
              'Seat elders near entrance, friends near dance floor, families by relation clusters.',
              'Book makeup and bridal trials 45 days before the event.',
            ].map((item, index) => (
              <div key={item} className="rounded-md border border-gold-100 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-bold text-gold-700 dark:text-gold-300">Recommendation {index + 1}</p>
                <p className="mt-1 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
