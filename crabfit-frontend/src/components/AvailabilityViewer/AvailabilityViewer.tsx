import { useState } from 'react';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {
	Wrapper,
	Container,
	Date,
	DateLabel,
	DayLabel,
	Time,
	Spacer,
	Tooltip,
	TooltipTitle,
	TooltipDate,
	TooltipContent,
} from './availabilityViewerStyle';

dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const AvailabilityViewer = ({
	dates,
	times,
	people = [],
	...props
}) => {
	const [tooltip, setTooltip] = useState(null);

	return (
		<Wrapper>
			<Container>
				{dates.map((date, i) => {
					const parsedDate = dayjs(date, 'DDMMYYYY');
					const last = dates.length === i+1 || dayjs(dates[i+1], 'DDMMYYYY').diff(parsedDate, 'day') > 1;
					return (
						<>
							<Date key={i} className={last ? 'last' : ''}>
								<DateLabel>{parsedDate.format('MMM D')}</DateLabel>
								<DayLabel>{parsedDate.format('ddd')}</DayLabel>

								{times.map((time, i) => {
									const peopleHere = people.filter(person => person.availability.includes(`${time}-${date}`)).map(person => person.name);
									return (
										<Time
											key={i}
											time={time}
											className="time"
											people={peopleHere}
											aria-label={peopleHere.join(', ')}
											totalPeople={people.length}
											onMouseEnter={(e) => {
												const cellBox = e.currentTarget.getBoundingClientRect();
												setTooltip({
													x: Math.round(cellBox.x + cellBox.width),
													y: Math.round(cellBox.y + cellBox.height),
													available: `${peopleHere.length} / ${people.length} available`,
													date: parsedDate.hour(time.slice(0, 2)).minute(time.slice(-2)).format('h:mma ddd, D MMM YYYY'),
													people: peopleHere.join(', '),
												});
											}}
											onMouseLeave={() => {
												setTooltip(null);
											}}
										/>
									);
								})}
							</Date>
							{last && dates.length !== i+1 && (
								<Spacer />
							)}
						</>
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
