import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { expenseBreakdown } from '../utils/mockData'
import { formatLKR } from '../utils/currency'

export function BudgetPage() {
  return (
    <section className="section-shell py-8">
      <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Budget intelligence</p>
      <h1 className="font-display text-4xl font-bold">Expenses, categories and AI recommendations</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-lg p-6">
          <h2 className="text-xl font-bold">Expense categories</h2>
          <div className="mt-4 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ead9b5" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatLKR(Number(value))} />
                <Bar dataKey="value" fill="#c59b3b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel rounded-lg p-6">
          <h2 className="text-xl font-bold">AI budget advisor</h2>
          {[
            'Move 6% from decor to catering for a 245 guest wedding in Colombo.',
            'Keep photography deposit below 40% until final album scope is confirmed.',
            'Reserve LKR 350,000 contingency for weather backup and transport.',
          ].map((item) => (
            <div key={item} className="mt-4 rounded-md bg-white/70 p-4 text-sm dark:bg-white/5">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
