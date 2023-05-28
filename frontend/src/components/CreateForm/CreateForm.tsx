'use client'

import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { range } from '@giraugh/tools'
import { Temporal } from '@js-temporal/polyfill'

import Button from '/src/components/Button/Button'
import CalendarField from '/src/components/CalendarField/CalendarField'
import { default as ErrorAlert } from '/src/components/Error/Error'
import SelectField from '/src/components/SelectField/SelectField'
import TextField from '/src/components/TextField/TextField'
import TimeRangeField from '/src/components/TimeRangeField/TimeRangeField'
import { createEvent, EventResponse } from '/src/config/api'
import { useTranslation } from '/src/i18n/client'
import timezones from '/src/res/timezones.json'
import useRecentsStore from '/src/stores/recentsStore'

import EventInfo from './components/EventInfo/EventInfo'
import styles from './CreateForm.module.scss'

interface Fields {
  name: string
  /** As `YYYY-MM-DD` or `d` */
  dates: string[]
  time: {
    start: number
    end: number
  }
  timezone: string
}

const defaultValues: Fields = {
  name: '',
  dates: [],
  time: { start: 9, end: 17 },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}

const CreateForm = ({ noRedirect }: { noRedirect?: boolean }) => {
  const { t } = useTranslation('home')
  const { push } = useRouter()

  const addRecent = useRecentsStore(state => state.addRecent)

  const {
    register,
    handleSubmit,
    control,
  } = useForm({ defaultValues })

  const [isLoading, setIsLoading] = useState(false)
  const [createdEvent, setCreatedEvent] = useState<EventResponse>()
  const [error, setError] = useState<React.ReactNode>()

  const onSubmit: SubmitHandler<Fields> = async values => {
    setIsLoading(true)
    setError(undefined)

    const { name, dates, time, timezone } = values

    try {
      if (dates.length === 0) {
        return setError(t('form.errors.no_dates'))
      }
      if (time.start === time.end) {
        return setError(t('form.errors.same_times'))
      }

      // If format is `YYYY-MM-DD` or `d`
      const isSpecificDates = dates[0].length !== 1

      const times = dates.flatMap(dateStr => {
        const date = isSpecificDates
          ? Temporal.PlainDate.from(dateStr)
          : Temporal.Now.plainDateISO().add({ days: Number(dateStr) - Temporal.Now.plainDateISO().dayOfWeek })

        const hours = time.start > time.end ? [...range(0, time.end - 1), ...range(time.start, 23)] : range(time.start, time.end - 1)

        return hours.map(hour => {
          const dateTime = date.toZonedDateTime({ timeZone: timezone, plainTime: Temporal.PlainTime.from({ hour }) }).withTimeZone('UTC')
          if (isSpecificDates) {
            // Format as `HHmm-DDMMYYYY`
            return `${dateTime.hour.toString().padStart(2, '0')}${dateTime.minute.toString().padStart(2, '0')}-${dateTime.day.toString().padStart(2, '0')}${dateTime.month.toString().padStart(2, '0')}${dateTime.year.toString().padStart(4, '0')}`
          } else {
            // Format as `HHmm-d`
            return `${dateTime.hour.toString().padStart(2, '0')}${dateTime.minute.toString().padStart(2, '0')}-${String(dateTime.dayOfWeek === 7 ? 0 : dateTime.dayOfWeek)}`
          }
        })
      })

      if (times.length === 0) {
        return setError(t('form.errors.no_time'))
      }

      const newEvent = await createEvent({ name, times, timezone }).catch(e => {
        console.error(e)
        throw new Error('Failed to create event')
      })

      if (noRedirect) {
        // Show event link
        setCreatedEvent(newEvent)
        addRecent({
          id: newEvent.id,
          name: newEvent.name,
          created_at: newEvent.created_at,
        })
      } else {
        // Navigate to the new event
        push(`/${newEvent.id}`)
      }
    } catch (e) {
      setError(t('form.errors.unknown'))
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return createdEvent ? <EventInfo event={createdEvent} /> : <form
    style={{ marginBlockEnd: noRedirect ? 30 : 60 }}
    onSubmit={handleSubmit(onSubmit)}
    id="create"
  >
    <TextField
      label={t('form.name.label')}
      description={t('form.name.sublabel')}
      type="text"
      {...register('name')}
    />

    <CalendarField
      label={t('form.dates.label')}
      description={t('form.dates.sublabel')}
      control={control}
      name="dates"
    />

    <TimeRangeField
      label={t('form.times.label')}
      description={t('form.times.sublabel')}
      control={control}
      name="time"
    />

    <SelectField
      label={t('form.timezone.label')}
      options={timezones}
      required
      {...register('timezone')}
      defaultOption={t('form.timezone.defaultOption')}
    />

    <ErrorAlert onClose={() => setError(undefined)}>{error}</ErrorAlert>

    <div className={styles.buttonWrapper}>
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        style={noRedirect ? { width: '100%' } : undefined}
      >{t('form.button')}</Button>
    </div>
  </form>
}

export default CreateForm
