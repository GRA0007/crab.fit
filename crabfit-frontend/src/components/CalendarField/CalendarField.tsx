import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';

import { Button, ToggleField } from 'components';
import { useSettingsStore } from 'stores';

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

const CalendarField = ({
	label,
	subLabel,
	id,
	register,
	...props
}) => {
  const weekStart = useSettingsStore(state => state.weekStart);

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

	useEffect(() => {
    if (weekStart !== dayjs.Ls.en.weekStart) {
      dayjs.updateLocale('en', {
        weekStart: weekStart,
        weekdaysShort: weekStart ? 'Mon_Tue_Wed_Thu_Fri_Sat_Sun'.split('_') : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
      });
    }
		setDates(calculateMonth(month, year, weekStart));
	}, [weekStart, month, year]);

	return (
		<Wrapper>
			{label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
			{subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}
			<input
				id={id}
				type="hidden"
				ref={register}
				value={type ? JSON.stringify(selectedDays) : JSON.stringify(selectedDates)}
				{...props}
			/>

      <ToggleField
        id="calendarMode"
        name="calendarMode"
        options={['Specific dates', 'Days of the week']}
        value={type ? 'Days of the week' : 'Specific dates'}
        onChange={value => setType(value === 'Specific dates' ? 0 : 1)}
      />

      {type === 0 ? (
        <>
    			<CalendarHeader>
    				<Button
    					buttonHeight="30px"
    					buttonWidth="30px"
    					title="Previous month"
    					type="button"
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
    					buttonHeight="30px"
    					buttonWidth="30px"
    					title="Next month"
    					type="button"
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
    				{dayjs.weekdaysShort().map(name =>
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
    							title={`${date.date()} ${dayjs.months()[date.month()]}${date.isToday() ? ' (today)' : ''}`}
    							selected={selectedDates.includes(date.format('DDMMYYYY'))}
    							selecting={selectingDates.includes(date)}
    							mode={mode}
    							onPointerDown={(e) => {
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
          {dayjs.weekdaysShort().map((name, i) =>
            <Date
              key={name}
              isToday={dayjs.weekdaysShort()[dayjs().day()-weekStart] === name}
              title={dayjs.weekdaysShort()[dayjs().day()-weekStart] === name ? 'Today' : ''}
              selected={selectedDays.includes(((i + weekStart) % 7 + 7) % 7)}
              selecting={selectingDays.includes(((i + weekStart) % 7 + 7) % 7)}
              mode={mode}
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
};

export default CalendarField;
