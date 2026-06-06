import { CalendarPlus, Heart, ImagePlus, MessageCircle, Pencil, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { loadEvents } from '../features/events/eventSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import {
  addGalleryComment,
  createGalleryPost,
  deleteGalleryComment,
  deleteGalleryPost,
  fetchGalleryPost,
  fetchGalleryPosts,
  toggleGalleryLike,
  updateGalleryPost,
} from '../services/galleryService'
import type { EventPlan, GalleryPost } from '../types/domain'

const eventTypes = ['All', 'Wedding', 'Birthday', 'Engagement', 'Corporate', 'Other']
const budgetRanges = ['All', 'Under LKR 100,000', 'LKR 100,000 - 500,000', 'Above LKR 500,000']
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export function InspirationGalleryPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const events = useAppSelector((state) => state.events.items)
  const [posts, setPosts] = useState<GalleryPost[]>([])
  const [search, setSearch] = useState('')
  const [eventType, setEventType] = useState('All')
  const [budgetRange, setBudgetRange] = useState('All')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<GalleryPost | null>(null)
  const [viewing, setViewing] = useState<GalleryPost | null>(null)

  useEffect(() => {
    if (user?.role === 'customer') {
      dispatch(loadEvents({}))
    }
  }, [dispatch, user?.role])

  const loadPosts = async () => {
    try {
      const response = await fetchGalleryPosts({
        search: search || undefined,
        eventType: eventType === 'All' ? undefined : eventType,
        budgetRange: budgetRange === 'All' ? undefined : budgetRange,
      })
      setPosts(response.items)
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not load gallery'
      toast.error(message)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadPosts(), 250)
    return () => window.clearTimeout(timer)
  }, [budgetRange, eventType, search])

  const selectedPost = useMemo(() => viewing && posts.find((post) => postId(post) === postId(viewing)) || viewing, [posts, viewing])

  const refreshPost = async (id: string) => {
    const post = await fetchGalleryPost(id)
    setPosts((current) => current.map((item) => (postId(item) === id ? post : item)))
    setViewing((current) => (current && postId(current) === id ? post : current))
  }

  return (
    <section className="px-4 py-8 text-ivory-50 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-300">Event Inspiration Gallery</p>
          <h1 className="font-display text-4xl font-bold">CelebrateLK ideas from real events</h1>
          <p className="mt-2 max-w-2xl text-sm text-ivory-50/62">
            Share completed event photos and browse ideas from other CelebrateLK customers.
          </p>
        </div>
        <Button
          icon={<CalendarPlus size={18} />}
          onClick={() => {
            if (user?.role !== 'customer') {
              toast.error('Please log in as a customer to create a gallery post')
              return
            }
            setCreating(true)
          }}
        >
          Create Gallery Post
        </Button>
      </div>

      <div className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-white/6 p-4 md:grid-cols-[1fr_220px_260px]">
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-white/10 bg-charcoal-900 px-3">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-ivory-50/42"
            placeholder="Search title, location or event type"
          />
        </label>
        <select value={eventType} onChange={(event) => setEventType(event.target.value)} className="field-dark">
          {eventTypes.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={budgetRange} onChange={(event) => setBudgetRange(event.target.value)} className="field-dark">
          {budgetRanges.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      {posts.length === 0 ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/6 p-10 text-center shadow-soft">
          <ImagePlus className="mx-auto text-gold-300" size={38} />
          <h2 className="mt-4 text-2xl font-bold">No inspiration posts yet</h2>
          <p className="mt-2 text-sm text-ivory-50/58">Share photos from a completed event to inspire other customers.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <GalleryPostCard
              key={postId(post)}
              post={post}
              userId={user?.id}
              onView={() => setViewing(post)}
              onEdit={() => setEditing(post)}
              onDelete={async () => {
                if (!window.confirm('Delete this gallery post?')) return
                await deleteGalleryPost(postId(post))
                toast.success('Gallery post deleted')
                await loadPosts()
              }}
              onLike={async () => {
                if (!user?.id) {
                  toast.error('Please log in to like gallery posts')
                  return
                }
                const result = await toggleGalleryLike(postId(post))
                setPosts((current) => current.map((item) => (postId(item) === postId(post) ? result.post : item)))
              }}
            />
          ))}
        </div>
      )}

      {creating && <CreateGalleryPostModal events={events} onClose={() => setCreating(false)} onSaved={async () => { setCreating(false); await loadPosts() }} />}
      {editing && <CreateGalleryPostModal events={events} post={editing} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await loadPosts() }} />}
      {selectedPost && (
        <GalleryDetailsModal
          post={selectedPost}
          userId={user?.id}
          onClose={() => setViewing(null)}
          onRefresh={() => refreshPost(postId(selectedPost))}
        />
      )}
    </section>
  )
}

function GalleryPostCard({
  post,
  userId,
  onView,
  onEdit,
  onDelete,
  onLike,
}: {
  post: GalleryPost
  userId?: string
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onLike: () => void
}) {
  const owner = isOwner(post, userId)
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/6 shadow-soft transition hover:-translate-y-1 hover:border-gold-300/40">
      <button className="block w-full text-left" onClick={onView}>
        <img src={post.images[0]?.url} alt={post.title} className="h-56 w-full object-cover" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gold-300">{post.eventType}</p>
              <h2 className="mt-1 text-xl font-bold">{post.title}</h2>
            </div>
            <span className="rounded-md bg-gold-300/14 px-2 py-1 text-xs font-bold text-gold-300">{post.budgetRange}</span>
          </div>
          <p className="mt-2 text-sm text-ivory-50/62">{post.location}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-ivory-50/72">{post.description}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-ivory-50/50">
            <span>{customerName(post)}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </button>
      <div className="flex items-center justify-between border-t border-white/10 p-4">
        <LikeButton liked={post.likes.some((id) => String(id) === userId)} count={post.likes.length} onClick={onLike} />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm text-ivory-50/62"><MessageCircle size={15} /> {post.comments.length}</span>
          {owner && (
            <>
              <IconButton label="Edit post" onClick={onEdit}><Pencil size={15} /></IconButton>
              <IconButton label="Delete post" tone="danger" onClick={onDelete}><Trash2 size={15} /></IconButton>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

function CreateGalleryPostModal({
  events,
  post,
  onClose,
  onSaved,
}: {
  events: EventPlan[]
  post?: GalleryPost
  onClose: () => void
  onSaved: () => void
}) {
  const [files, setFiles] = useState<File[]>([])
  const [eventId, setEventId] = useState(post?.eventId ?? events[0]?._id ?? events[0]?.id ?? '')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const formData = new FormData()
    ;['title', 'eventType', 'location', 'budgetRange', 'description'].forEach((key) => {
      formData.append(key, String(form.get(key) ?? ''))
    })
    formData.append('eventId', eventId)
    files.forEach((file) => formData.append('images', file))

    try {
      if (post) {
        await updateGalleryPost(postId(post), formData)
        toast.success('Gallery post updated')
      } else {
        await createGalleryPost(formData)
        toast.success('Gallery post created')
      }
      onSaved()
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not save gallery post'
      toast.error(message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <form onSubmit={submit} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-charcoal-900 p-6 text-ivory-50 shadow-luxury">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gold-300">Event Inspiration Gallery</p>
            <h2 className="font-display text-3xl font-bold">{post ? 'Edit gallery post' : 'Create gallery post'}</h2>
          </div>
          <button type="button" className="grid size-10 place-items-center rounded-md hover:bg-white/10" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="field-dark">
            {events.map((event) => <option key={event._id ?? event.id} value={event._id ?? event.id}>{event.eventTitle}</option>)}
          </select>
          <input name="title" defaultValue={post?.title} className="field-dark" placeholder="Event title" required />
          <select name="eventType" defaultValue={post?.eventType ?? 'Wedding'} className="field-dark">
            {eventTypes.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}
          </select>
          <input name="location" defaultValue={post?.location} className="field-dark" placeholder="Location" required />
          <select name="budgetRange" defaultValue={post?.budgetRange ?? 'LKR 100,000 - 500,000'} className="field-dark md:col-span-2">
            {budgetRanges.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}
          </select>
          <textarea name="description" defaultValue={post?.description} rows={4} className="field-dark md:col-span-2" placeholder="Tell the story behind this event..." required />
          <div className="md:col-span-2">
            <ImageUpload files={files} onChange={setFiles} existingCount={post?.images.length ?? 0} />
          </div>
        </div>
        <Button className="mt-5 w-full" icon={<ImagePlus size={18} />}>{post ? 'Save Post' : 'Create Post'}</Button>
      </form>
    </div>
  )
}

function ImageUpload({ files, onChange, existingCount }: { files: File[]; onChange: (files: File[]) => void; existingCount: number }) {
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const selected = Array.from(fileList)
    const invalid = selected.find((file) => !allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024)
    if (invalid) {
      toast.error('Use jpg, jpeg, png or webp images up to 5MB each')
      return
    }
    if (selected.length + existingCount > 8) {
      toast.error('You can upload up to 8 photos')
      return
    }
    onChange(selected)
  }

  return (
    <label className="grid min-h-32 cursor-pointer place-items-center rounded-lg border border-dashed border-gold-300/50 bg-white/5 p-5 text-center">
      <span>
        <ImagePlus className="mx-auto text-gold-300" />
        <span className="mt-2 block text-sm text-ivory-50/70">{files.length ? `${files.length} new photo(s) selected` : 'Upload event photos'}</span>
      </span>
      <input type="file" multiple accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => handleFiles(event.target.files)} />
    </label>
  )
}

function GalleryDetailsModal({ post, userId, onClose, onRefresh }: { post: GalleryPost; userId?: string; onClose: () => void; onRefresh: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg border border-white/10 bg-charcoal-900 p-6 text-ivory-50 shadow-luxury">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gold-300">{post.eventType} / {post.location}</p>
            <h2 className="font-display text-3xl font-bold">{post.title}</h2>
          </div>
          <button type="button" className="grid size-10 place-items-center rounded-md hover:bg-white/10" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {post.images.map((image) => <img key={image.url} src={image.url} alt={post.title} className="h-72 w-full rounded-lg object-cover" />)}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="rounded-lg bg-white/6 p-5 text-sm leading-7 text-ivory-50/76">{post.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-md bg-gold-300/14 px-3 py-2 text-gold-300">{post.budgetRange}</span>
              <span className="rounded-md bg-white/8 px-3 py-2">{customerName(post)}</span>
              <span className="rounded-md bg-white/8 px-3 py-2">{formatDate(post.createdAt)}</span>
            </div>
          </div>
          <div>
            <LikeButton
              liked={post.likes.some((id) => String(id) === userId)}
              count={post.likes.length}
              onClick={async () => {
                if (!userId) {
                  toast.error('Please log in to like gallery posts')
                  return
                }
                await toggleGalleryLike(postId(post))
                await onRefresh()
              }}
            />
            <CommentSection post={post} userId={userId} onRefresh={onRefresh} />
          </div>
        </div>
      </div>
    </div>
  )
}

function LikeButton({ liked, count, onClick }: { liked: boolean; count: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-bold transition ${liked ? 'bg-gold-300 text-charcoal-900' : 'bg-white/8 text-ivory-50 hover:bg-white/12'}`}>
      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      {count} Likes
    </button>
  )
}

function CommentSection({ post, userId, onRefresh }: { post: GalleryPost; userId?: string; onRefresh: () => void }) {
  const [text, setText] = useState('')
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!userId) {
      toast.error('Please log in to comment')
      return
    }
    if (!text.trim()) return
    await addGalleryComment(postId(post), text.trim())
    setText('')
    await onRefresh()
  }
  return (
    <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="font-bold">Comments</h3>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input value={text} onChange={(event) => setText(event.target.value)} className="field-dark min-w-0 flex-1" placeholder="Add a comment" />
        <Button>Post</Button>
      </form>
      <div className="mt-4 grid gap-3">
        {post.comments.length === 0 && <p className="text-sm text-ivory-50/54">No comments yet.</p>}
        {post.comments.map((comment) => (
          <div key={comment._id ?? comment.id} className="rounded-md bg-charcoal-900/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold">{comment.userName}</p>
                <p className="mt-1 text-sm text-ivory-50/72">{comment.text}</p>
              </div>
              {String(comment.userId) === userId && (
                <button type="button" className="text-blush-300" onClick={async () => { await deleteGalleryComment(postId(post), comment._id ?? comment.id ?? ''); await onRefresh() }} aria-label="Delete comment">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function IconButton({ label, tone = 'default', children, onClick }: { label: string; tone?: 'default' | 'danger'; children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" title={label} aria-label={label} className={`grid size-8 place-items-center rounded-md border transition hover:-translate-y-0.5 ${tone === 'danger' ? 'border-blush-300/30 text-blush-300 hover:bg-blush-700/20' : 'border-white/10 hover:bg-white/10'}`} onClick={onClick}>
      {children}
    </button>
  )
}

function postId(post: GalleryPost) {
  return post._id ?? post.id ?? ''
}

function customerName(post: GalleryPost) {
  return typeof post.customerId === 'object' ? post.customerId.name ?? 'CelebrateLK Customer' : 'CelebrateLK Customer'
}

function isOwner(post: GalleryPost, userId?: string) {
  if (!userId || !post.customerId) return false
  return typeof post.customerId === 'object' ? String(post.customerId._id ?? post.customerId.id) === userId : String(post.customerId) === userId
}

function formatDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
