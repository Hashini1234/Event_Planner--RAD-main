import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { EventPlan } from '../../types/domain'
import * as eventService from '../../services/eventService'

interface EventState {
  items: EventPlan[]
  loading: boolean
  error: string | null
}

const initialState: EventState = {
  items: [],
  loading: false,
  error: null,
}

export const loadEvents = createAsyncThunk('events/load', eventService.fetchEvents)
export const addEvent = createAsyncThunk('events/add', eventService.createEvent)
export const removeEvent = createAsyncThunk('events/remove', eventService.deleteEvent)

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to load events'
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(removeEvent.fulfilled, (state, action) => {
        state.items = state.items.filter((event) => (event._id ?? event.id) !== action.payload.id)
      })
  },
})

export default eventSlice.reducer
