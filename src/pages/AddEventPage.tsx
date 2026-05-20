import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ImagePlus, Loader2, Save } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/Button'
import { addEvent } from '../features/events/eventSlice'
import { useAppDispatch } from '../hooks/redux'
import { sriLankaDistricts } from '../types/domain'

const eventTypes = ['Wedding', 'Birthday', 'Engagement', 'Corporate', 'Anniversary', 'Party', 'Other'] as const
const statuses = ['Planning', 'Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled'] as const

const schema = z.object({
  eventTitle: z.string().min(3, 'Event title must be at least 3 characters'),
  eventType: z.enum(eventTypes),
  eventDate: z.string().min(1, 'Event date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  venue: z.string().min(2, 'Venue is required'),
  district: z.string().min(1, 'District is required'),
  guestCount: z.coerce.number().min(1, 'Guest count must be at least 1'),
  description: z.string().max(2000).optional(),
  theme: z.string().max(80).optional(),
  budget: z.coerce.number().min(0, 'Budget cannot be negative'),
  status: z.enum(statuses),
  notes: z.string().max(2000).optional(),
})

type EventFormInput = z.input<typeof schema>
type EventFormValues = z.output<typeof schema>

export function AddEventPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: 'Wedding',
      district: 'Colombo',
      status: 'Planning',
      guestCount: 100,
      budget: 500000,
    },
  })

  const fieldClass = useMemo(
    () =>
      'rounded-md border border-gold-100 bg-white px-3 py-3 text-sm outline-none transition focus:border-gold-500 dark:border-white/10 dark:bg-charcoal-800',
    [],
  )

  const onImageChange = (file?: File) => {
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (values: EventFormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value ?? '')))
    if (image) formData.append('eventImage', image)

    try {
      await dispatch(addEvent(formData)).unwrap()
      toast.success('Event created successfully')
      navigate('/events')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create event')
    }
  }

  return (
    <section className="section-shell py-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold text-gold-700 dark:text-gold-300">Create event</p>
        <h1 className="font-display text-4xl font-bold">Add a new celebration</h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal-800/68 dark:text-ivory-100/68">
          Capture the essentials, upload an event image, and start tracking vendors, guests and budget immediately.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="glass-panel grid gap-5 rounded-lg p-6 md:grid-cols-2">
          <Field label="Event Title" error={errors.eventTitle?.message}>
            <input {...register('eventTitle')} className={fieldClass} placeholder="Amani & Nuwan Wedding" />
          </Field>
          <Field label="Event Type" error={errors.eventType?.message}>
            <select {...register('eventType')} className={fieldClass}>
              {eventTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </Field>
          <Field label="Event Date" error={errors.eventDate?.message}>
            <input {...register('eventDate')} type="date" className={fieldClass} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Time" error={errors.startTime?.message}>
              <input {...register('startTime')} type="time" className={fieldClass} />
            </Field>
            <Field label="End Time" error={errors.endTime?.message}>
              <input {...register('endTime')} type="time" className={fieldClass} />
            </Field>
          </div>
          <Field label="Venue" error={errors.venue?.message}>
            <input {...register('venue')} className={fieldClass} placeholder="Cinnamon Grand Colombo" />
          </Field>
          <Field label="District" error={errors.district?.message}>
            <select {...register('district')} className={fieldClass}>
              {sriLankaDistricts.map((district) => (
                <option key={district}>{district}</option>
              ))}
            </select>
          </Field>
          <Field label="Guest Count" error={errors.guestCount?.message}>
            <input {...register('guestCount')} type="number" className={fieldClass} />
          </Field>
          <Field label="Event Budget (LKR)" error={errors.budget?.message}>
            <input {...register('budget')} type="number" className={fieldClass} />
          </Field>
          <Field label="Theme" error={errors.theme?.message}>
            <input {...register('theme')} className={fieldClass} placeholder="Ivory, gold and jasmine" />
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <select {...register('status')} className={fieldClass}>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </Field>
          <Field label="Description" error={errors.description?.message} className="md:col-span-2">
            <textarea {...register('description')} rows={4} className={fieldClass} />
          </Field>
          <Field label="Notes" error={errors.notes?.message} className="md:col-span-2">
            <textarea {...register('notes')} rows={3} className={fieldClass} />
          </Field>
        </div>

        <aside className="glass-panel h-fit rounded-lg p-6">
          <h2 className="text-xl font-bold">Event Image</h2>
          <label className="mt-4 flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-gold-300 bg-white/70 text-center dark:bg-white/5">
            {preview ? (
              <img src={preview} alt="Event preview" className="h-full w-full object-cover" />
            ) : (
              <span className="grid place-items-center gap-2 text-sm text-charcoal-800/65 dark:text-ivory-100/65">
                <ImagePlus />
                Upload event image
              </span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(event) => onImageChange(event.target.files?.[0])} />
          </label>
          <Button type="submit" className="mt-5 w-full" disabled={isSubmitting} icon={isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}>
            {isSubmitting ? 'Creating event...' : 'Create Event'}
          </Button>
        </aside>
      </form>
    </section>
  )
}

function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`grid gap-2 text-sm font-medium ${className}`}>
      {label}
      {children}
      {error && <span className="text-xs font-semibold text-blush-700">{error}</span>}
    </label>
  )
}
