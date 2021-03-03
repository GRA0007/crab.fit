import { useState, useRef, Fragment } from 'react';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {
	Wrapper,
	Container,
	Date,
	DateLabel,
	DayLabel,
	Spacer,
	TimeLabels,
	TimeLabel,
	TimeSpace,
} from 'components/AvailabilityViewer/availabilityViewerStyle';
import { Time } from './availabilityEditorStyle';

dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const AvailabilityEditor = ({
	dates,
	times,
	value = [],
	onChange,
	...props
}) => {
	const [selectingTimes, _setSelectingTimes] = useState([]);
	const staticSelectingTimes = useRef([]);
	const setSelectingTimes = newTimes => {
		staticSelectingTimes.current = newTimes;
		_setSelectingTimes(newTimes);
	};

	const startPos = useRef({});
	const staticMode = useRef(null);
	const [mode, _setMode] = useState(staticMode.current);
	const setMode = newMode => {
		staticMode.current = newMode;
		_setMode(newMode);
	};

	return (
		<Wrapper>
			<Container>
				<TimeLabels>
					{times.concat([`${parseInt(times[times.length-1].slice(0, 2))+1}00`]).map((time, i) =>
						<TimeSpace key={i} time={time}>
							{time.slice(-2) === '00' && <TimeLabel>{dayjs().hour(time.slice(0, 2)).minute(time.slice(-2)).format('h A')}</TimeLabel>}
						</TimeSpace>
					)}
				</TimeLabels>
				{dates.map((date, x) => {
					const parsedDate = dayjs(date, 'DDMMYYYY');
					const last = dates.length === x+1 || dayjs(dates[x+1], 'DDMMYYYY').diff(parsedDate, 'day') > 1;
					return (
						<Fragment key={x}>
							<Date className={last ? 'last' : ''}>
								<DateLabel>{parsedDate.format('MMM D')}</DateLabel>
								<DayLabel>{parsedDate.format('ddd')}</DayLabel>

								{times.map((time, y) =>
									<Time
										key={x+y}
										time={time}
										className="time"
										selected={value.includes(`${time}-${date}`)}
										selecting={selectingTimes.includes(`${time}-${date}`)}
										mode={mode}
										onPointerDown={(e) => {
											e.preventDefault();
											startPos.current = {x, y};
											setMode(value.includes(`${time}-${date}`) ? 'remove' : 'add');
											setSelectingTimes([`${time}-${date}`]);
											e.currentTarget.releasePointerCapture(e.pointerId);

											document.addEventListener('pointerup', () => {
												if (staticMode.current === 'add') {
													onChange([...value, ...staticSelectingTimes.current]);
												} else if (staticMode.current === 'remove') {
													onChange(value.filter(t => !staticSelectingTimes.current.includes(t)));
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
												setSelectingTimes(found.map(d => `${times[d.y]}-${dates[d.x]}`));
											}
										}}
									/>
								)}
							</Date>
							{last && dates.length !== x+1 && (
								<Spacer />
							)}
						</Fragment>
					);
				})}
			</Container>
		</Wrapper>
	);
};

export default AvailabilityEditor;
