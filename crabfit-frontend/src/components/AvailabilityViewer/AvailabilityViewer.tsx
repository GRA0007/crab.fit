import { useState, Fragment } from 'react';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { useSettingsStore } from 'stores';

import {
	Wrapper,
	Container,
	Date,
	Times,
	DateLabel,
	DayLabel,
	Time,
	Spacer,
	Tooltip,
	TooltipTitle,
	TooltipDate,
	TooltipContent,
	TimeLabels,
	TimeLabel,
	TimeSpace,
} from './availabilityViewerStyle';

dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const AvailabilityViewer = ({
	times,
	timeLabels,
	dates,
  isSpecificDates,
	people = [],
	min = 0,
	max = 0,
	...props
}) => {
	const [tooltip, setTooltip] = useState(null);
  const timeFormat = useSettingsStore(state => state.timeFormat);

	return (
		<Wrapper>
			<Container>
				<TimeLabels>
					{!!timeLabels.length && timeLabels.map((label, i) =>
						<TimeSpace key={i}>
							{label.label?.length !== '' && <TimeLabel>{label.label}</TimeLabel>}
						</TimeSpace>
					)}
				</TimeLabels>
				{dates.map((date, i) => {
					const parsedDate = isSpecificDates ? dayjs(date, 'DDMMYYYY') : dayjs().day(date);
					const last = dates.length === i+1 || (isSpecificDates ? dayjs(dates[i+1], 'DDMMYYYY') : dayjs().day(dates[i+1])).diff(parsedDate, 'day') > 1;
					return (
						<Fragment key={i}>
							<Date>
								{isSpecificDates && <DateLabel>{parsedDate.format('MMM D')}</DateLabel>}
								<DayLabel>{parsedDate.format('ddd')}</DayLabel>

								<Times>
									{timeLabels.map((timeLabel, i) => {
										if (!timeLabel.time) return null;
										if (!times.includes(`${timeLabel.time}-${date}`)) {
											return (
												<TimeSpace key={i} />
											);
										}
										const time = `${timeLabel.time}-${date}`;
										const peopleHere = people.filter(person => person.availability.includes(time)).map(person => person.name);

										return (
											<Time
												key={i}
												time={time}
												className="time"
												peopleCount={peopleHere.length}
												aria-label={peopleHere.join(', ')}
												maxPeople={max}
												minPeople={min}
												onMouseEnter={(e) => {
													const cellBox = e.currentTarget.getBoundingClientRect();
                          const timeText = timeFormat === '12h' ? 'h:mma' : 'HH:mm';
													setTooltip({
														x: Math.round(cellBox.x + cellBox.width/2),
														y: Math.round(cellBox.y + cellBox.height)+6,
														available: `${peopleHere.length} / ${people.length} available`,
														date: parsedDate.hour(time.slice(0, 2)).minute(time.slice(2, 4)).format(isSpecificDates ? `${timeText} ddd, D MMM YYYY` : `${timeText} ddd`),
														people: peopleHere.join(', '),
													});
												}}
												onMouseLeave={() => {
													setTooltip(null);
												}}
											/>
										);
									})}
								</Times>
							</Date>
							{last && dates.length !== i+1 && (
								<Spacer />
							)}
						</Fragment>
					);
				})}
			</Container>
			{tooltip && (
				<Tooltip
					x={tooltip.x}
					y={tooltip.y}
				>
					<TooltipTitle>{tooltip.available}</TooltipTitle>
					<TooltipDate>{tooltip.date}</TooltipDate>
					<TooltipContent>{tooltip.people}</TooltipContent>
				</Tooltip>
			)}
		</Wrapper>
	);
};

export default AvailabilityViewer;
