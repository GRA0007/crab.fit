import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

import { Button } from 'components';
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

const days = [
	'Sun',
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat',
];

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const calculateMonth = (month, year) => {
	const date = dayjs().month(month).year(year);
	const daysInMonth = date.daysInMonth();
	const daysBefore = date.date(1).day();
	const daysAfter = 6 - date.date(daysInMonth).day();

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
	const [dates, setDates] = useState(calculateMonth(dayjs().month(), dayjs().year()));
	const [month, setMonth] = useState(dayjs().month());
	const [year, setYear] = useState(dayjs().year());

	const [selectedDates, setSelectedDates] = useState([]);
	const [selectingDates, _setSelectingDates] = useState([]);
	const staticSelectingDates = useRef([]);
	const setSelectingDates = newDates => {
		staticSelectingDates.current = newDates;
		_setSelectingDates(newDates);
	};

	const startPos = useRef({});
	const staticMode = useRef(null);
	const [mode, _setMode] = useState(staticMode.current);
	const setMode = newMode => {
		staticMode.current = newMode;
		_setMode(newMode);
	};

	useEffect(() => {
		setDates(calculateMonth(month, year));
	}, [month, year]);

	return (
		<Wrapper>
			{label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
			{subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}
			<input
				id={id}
				type="hidden"
				ref={register}
				value={JSON.stringify(selectedDates)}
				{...props}
			/>

			<CalendarHeader>
				<Button
					buttonHeight="30px"
					buttonWidth="30px"
					padding="0"
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
				<span>{months[month]} {year}</span>
				<Button
					buttonHeight="30px"
					buttonWidth="30px"
					padding="0"
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
				{days.map((name, i) =>
					<Day key={i}>{name}</Day>
				)}
			</CalendarDays>
			<CalendarBody>
				{dates.length > 0 && dates.map((dateRow, y) =>
					dateRow.map((date, x) =>
						<Date
							key={y+x}
							otherMonth={date.month() !== month}
							isToday={date.isToday()}
							title={`${date.date()} ${months[date.month()]}${date.isToday() ? ' (today)' : ''}`}
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
		</Wrapper>
	);
};

export default CalendarField;
