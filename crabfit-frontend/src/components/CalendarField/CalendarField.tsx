import { useState, useEffect, useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';

import { Button, ToggleField } from 'components';
import { useSettingsStore, useLocaleUpdateStore } from 'stores';

import {
  Wrapper,
  StyledLabel,
  StyledSubLabel,
  CalendarHeader,
  CalendarDays,
  CalendarBody,
  Date,
  Day,
} from './calendarFieldStyle';

dayjs.extend(isToday);
dayjs.extend(localeData);
dayjs.extend(updateLocale);

const calculateMonth = (month, year, weekStart) => {
  const date = dayjs().month(month).year(year);
  const daysInMonth = date.daysInMonth();
  const daysBefore = date.date(1).day() - weekStart;
  const daysAfter = 6 - date.date(daysInMonth).day() + weekStart;

  let dates = [];
  let curDate = date.date(1).subtract(daysBefore, 'day');
  let y = 0;
  let x = 0;
  for (let i = 0; i < daysBefore + daysInMonth + daysAfter; i++) {
    if (x === 0) dates[y] = [];
    dates[y][x] = curDate.clone();
    curDate = curDate.add(1, 'day');
    x++;
    if (x > 6) {
      x = 0;
      y++;
    }
  }

  return dates;
};

const CalendarField = forwardRef(({
  label,
  subLabel,
  id,
  setValue,
  ...props
}, ref) => {
  const weekStart = useSettingsStore(state => state.weekStart);
  const locale = useLocaleUpdateStore(state => state.locale);
  const { t } = useTranslation('home');

  const [type, setType] = useState(0);

  const [dates, setDates] = useState(calculateMonth(dayjs().month(), dayjs().year(), weekStart));
  const [month, setMonth] = useState(dayjs().month());
  const [year, setYear] = useState(dayjs().year());

  const [selectedDates, setSelectedDates] = useState([]);
  const [selectingDates, _setSelectingDates] = useState([]);
  const staticSelectingDates = useRef([]);
  const setSelectingDates = newDates => {
    staticSelectingDates.current = newDates;
    _setSelectingDates(newDates);
  };

  const [selectedDays, setSelectedDays] = useState([]);
  const [selectingDays, _setSelectingDays] = useState([]);
  const staticSelectingDays = useRef([]);
  const setSelectingDays = newDays => {
    staticSelectingDays.current = newDays;
    _setSelectingDays(newDays);
  };

  const startPos = useRef({});
  const staticMode = useRef(null);
  const [mode, _setMode] = useState(staticMode.current);
  const setMode = newMode => {
    staticMode.current = newMode;
    _setMode(newMode);
  };

  useEffect(() => setValue(props.name, type ? JSON.stringify(selectedDays) : JSON.stringify(selectedDates)), [type, selectedDays, selectedDates, setValue, props.name]);

  useEffect(() => {
    if (dayjs.Ls.hasOwnProperty(locale) && weekStart !== dayjs.Ls[locale].weekStart) {
      dayjs.updateLocale(locale, { weekStart });
    }
    setDates(calculateMonth(month, year, weekStart));
  }, [weekStart, month, year, locale]);

  return (
    <Wrapper locale={locale}>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      {subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}
      <input
        id={id}
        type="hidden"
        ref={ref}
        value={type ? JSON.stringify(selectedDays) : JSON.stringify(selectedDates)}
        {...props}
      />

      <ToggleField
        id="calendarMode"
        name="calendarMode"
        options={{
          'specific': t('form.dates.options.specific'),
          'week': t('form.dates.options.week'),
        }}
        value={type === 0 ? 'specific' : 'week'}
        onChange={value => setType(value === 'specific' ? 0 : 1)}
      />

      {type === 0 ? (
        <>
          <CalendarHeader>
            <Button
              size="30px"
              title={t('form.dates.tooltips.previous')}
              onClick={() => {
                if (month-1 < 0) {
                  setYear(year-1);
                  setMonth(11);
                } else {
                  setMonth(month-1);
                }
              }}
            >&lt;</Button>
            <span>{dayjs.months()[month]} {year}</span>
            <Button
              size="30px"
              title={t('form.dates.tooltips.next')}
              onClick={() => {
                if (month+1 > 11) {
                  setYear(year+1);
                  setMonth(0);
                } else {
                  setMonth(month+1);
                }
              }}
            >&gt;</Button>
          </CalendarHeader>

          <CalendarDays>
            {(weekStart ? [...dayjs.weekdaysShort().filter((_,i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort()).map(name =>
              <Day key={name}>{name}</Day>
            )}
          </CalendarDays>
          <CalendarBody>
            {dates.length > 0 && dates.map((dateRow, y) =>
              dateRow.map((date, x) =>
                <Date
                  key={y+x}
                  otherMonth={date.month() !== month}
                  isToday={date.isToday()}
                  title={`${date.date()} ${dayjs.months()[date.month()]}${date.isToday() ? ` (${t('form.dates.tooltips.today')})` : ''}`}
                  selected={selectedDates.includes(date.format('DDMMYYYY'))}
                  selecting={selectingDates.includes(date)}
                  mode={mode}
                  type="button"
                  onKeyPress={e => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      if (selectedDates.includes(date.format('DDMMYYYY'))) {
                        setSelectedDates(selectedDates.filter(d => d !== date.format('DDMMYYYY')));
                      } else {
                        setSelectedDates([...selectedDates, date.format('DDMMYYYY')]);
                      }
                    }
                  }}
                  onPointerDown={e => {
                    startPos.current = {x, y};
                    setMode(selectedDates.includes(date.format('DDMMYYYY')) ? 'remove' : 'add');
                    setSelectingDates([date]);
                    e.currentTarget.releasePointerCapture(e.pointerId);

                    document.addEventListener('pointerup', () => {
                      if (staticMode.current === 'add') {
                        setSelectedDates([...selectedDates, ...staticSelectingDates.current.map(d => d.format('DDMMYYYY'))]);
                      } else if (staticMode.current === 'remove') {
                        const toRemove = staticSelectingDates.current.map(d => d.format('DDMMYYYY'));
                        setSelectedDates(selectedDates.filter(d => !toRemove.includes(d)));
                      }
                      setMode(null);
                    }, { once: true });
                  }}
                  onPointerEnter={() => {
                    if (staticMode.current) {
                      let found = [];
                      for (let cy = Math.min(startPos.current.y, y); cy < Math.max(startPos.current.y, y)+1; cy++) {
                        for (let cx = Math.min(startPos.current.x, x); cx < Math.max(startPos.current.x, x)+1; cx++) {
                          found.push({y: cy, x: cx});
                        }
                      }
                      setSelectingDates(found.map(d => dates[d.y][d.x]));
                    }
                  }}
                >{date.date()}</Date>
              )
            )}
          </CalendarBody>
        </>
      ) : (
        <CalendarBody>
          {(weekStart ? [...dayjs.weekdaysShort().filter((_,i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort()).map((name, i) =>
            <Date
              key={name}
              isToday={(weekStart ? [...dayjs.weekdaysShort().filter((_,i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort())[dayjs().day()-weekStart === -1 ? 6 : dayjs().day()-weekStart] === name}
              title={(weekStart ? [...dayjs.weekdaysShort().filter((_,i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort())[dayjs().day()-weekStart === -1 ? 6 : dayjs().day()-weekStart] === name ? t('form.dates.tooltips.today') : ''}
              selected={selectedDays.includes(((i + weekStart) % 7 + 7) % 7)}
              selecting={selectingDays.includes(((i + weekStart) % 7 + 7) % 7)}
              mode={mode}
              type="button"
              onKeyPress={e => {
                if (e.key === ' ' || e.key === 'Enter') {
                  if (selectedDays.includes(((i + weekStart) % 7 + 7) % 7)) {
                    setSelectedDays(selectedDays.filter(d => d !== ((i + weekStart) % 7 + 7) % 7));
                  } else {
                    setSelectedDays([...selectedDays, ((i + weekStart) % 7 + 7) % 7]);
                  }
                }
              }}
              onPointerDown={(e) => {
                startPos.current = i;
                setMode(selectedDays.includes(((i + weekStart) % 7 + 7) % 7) ? 'remove' : 'add');
                setSelectingDays([((i + weekStart) % 7 + 7) % 7]);
                e.currentTarget.releasePointerCapture(e.pointerId);

                document.addEventListener('pointerup', () => {
                  if (staticMode.current === 'add') {
                    setSelectedDays([...selectedDays, ...staticSelectingDays.current]);
                  } else if (staticMode.current === 'remove') {
                    const toRemove = staticSelectingDays.current;
                    setSelectedDays(selectedDays.filter(d => !toRemove.includes(d)));
                  }
                  setMode(null);
                }, { once: true });
              }}
              onPointerEnter={() => {
                if (staticMode.current) {
                  let found = [];
                  for (let ci = Math.min(startPos.current, i); ci < Math.max(startPos.current, i)+1; ci++) {
                    found.push(((ci + weekStart) % 7 + 7) % 7);
                  }
                  setSelectingDays(found);
                }
              }}
            >{name}</Date>
          )}
        </CalendarBody>
      )}
    </Wrapper>
  );
});

export default CalendarField;
