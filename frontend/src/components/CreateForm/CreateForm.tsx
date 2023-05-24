'use client'

import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import Button from '/src/components/Button/Button'
import CalendarField from '/src/components/CalendarField/CalendarField'
import { default as ErrorAlert } from '/src/components/Error/Error'
import SelectField from '/src/components/SelectField/SelectField'
import TextField from '/src/components/TextField/TextField'
import TimeRangeField from '/src/components/TimeRangeField/TimeRangeField'
import { API_BASE } from '/src/config/api'
import { useDayjs } from '/src/config/dayjs'
import { useTranslation } from '/src/i18n/client'
import timezones from '/src/res/timezones.json'

import styles from './CreateForm.module.scss'

interface Fields {
  name: string
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

const CreateForm = () => {
  const { t } = useTranslation('home')
  const dayjs = useDayjs()
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    control,
  } = useForm({ defaultValues })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<React.ReactNode>()

  const onSubmit: SubmitHandler<Fields> = async values => {
    setIsLoading(true)
    setError(undefined)

    const { name, dates, time, timezone } = values

    try {
      if (dates.length === 0) {
        return setError(t('form.errors.no_dates'))
      }
      const isSpecificDates = dates[0].length === 8
      if (time.start === time.end) {
        return setError(t('form.errors.same_times'))
      }

      const times = dates.reduce((times, date) => {
        const day = []
        for (let i = time.start; i < (time.start > time.end ? 24 : time.end); i++) {
          if (isSpecificDates) {
            day.push(
              dayjs.tz(date, 'DDMMYYYY', timezone)
                .hour(i).minute(0).utc().format('HHmm-DDMMYYYY')
            )
          } else {
            day.push(
              dayjs().tz(timezone)
                .day(Number(date)).hour(i).minute(0).utc().format('HHmm-d')
            )
          }
        }
        if (time.start > time.end) {
          for (let i = 0; i < time.end; i++) {
            if (isSpecificDates) {
              day.push(
                dayjs.tz(date, 'DDMMYYYY', timezone)
                  .hour(i).minute(0).utc().format('HHmm-DDMMYYYY')
              )
            } else {
              day.push(
                dayjs().tz(timezone)
                  .day(Number(date)).hour(i).minute(0).utc().format('HHmm-d')
              )
            }
          }
        }
        return [...times, ...day]
      }, [] as string[])

      if (times.length === 0) {
        return setError(t('form.errors.no_time'))
      }

      const res = await fetch(new URL('/event', API_BASE), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          times,
          timezone,
        }),
      })

      if (!res.ok) {
        console.error(res)
        throw new Error('Failed to create event')
      }

      const { id } = await res.json()

      // Navigate to the new event
      push(`/${id}`)
    } catch (e) {
      setError(t('form.errors.unknown'))
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return <form className={styles.form} onSubmit={handleSubmit(onSubmit)} id="create">
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
      >{t('form.button')}</Button>
    </div>
  </form>
}

export default CreateForm