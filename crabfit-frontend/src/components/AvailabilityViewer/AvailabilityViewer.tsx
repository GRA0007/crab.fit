import { useState, useEffect, useRef, Fragment } from 'react';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useSettingsStore } from 'stores';

import { Legend, Center } from 'components';
import {
	Wrapper,
	ScrollWrapper,
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
  TooltipPerson,
	TimeLabels,
	TimeLabel,
	TimeSpace,
  People,
  Person,
  StyledMain,
} from './availabilityViewerStyle';

dayjs.extend(localeData);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

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
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [touched, setTouched] = useState(false);
  const [tempFocus, setTempFocus] = useState(null);
  const [focusCount, setFocusCount] = useState(null);

  const wrapper = useRef();

  useEffect(() => {
    setFilteredPeople(people.map(p => p.name));
    setTouched(people.length <= 1);
  }, [people]);

	return (
    <>
      <StyledMain>
        <Legend
          min={Math.min(min, filteredPeople.length)}
          max={Math.min(max, filteredPeople.length)}
          total={people.filter(p => p.availability.length > 0).length}
          onSegmentFocus={count => setFocusCount(count)}
        />
        <Center>Hover or tap the calendar below to see who is available</Center>
        {people.length > 1 && (
          <>
            <Center>Click the names below to view people individually</Center>
            <People>
              {people.map((person, i) =>
                <Person
                  key={i}
                  filtered={filteredPeople.includes(person.name)}
                  onClick={() => {
                    setTempFocus(null);
                    if (filteredPeople.includes(person.name)) {
                      if (!touched) {
                        setTouched(true);
                        setFilteredPeople([person.name]);
                      } else {
                        setFilteredPeople(filteredPeople.filter(n => n !== person.name));
                      }
                    } else {
                      setFilteredPeople([...filteredPeople, person.name]);
                    }
                  }}
                  onMouseOver={() => setTempFocus(person.name)}
                  onMouseOut={() => setTempFocus(null)}
                  title={person.created && dayjs.unix(person.created).fromNow()}
                >{person.name}</Person>
              )}
            </People>
          </>
        )}
      </StyledMain>

  		<Wrapper ref={wrapper}>
    		<ScrollWrapper>
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
    										const peopleHere = tempFocus !== null
                          ? people.filter(person => person.availability.includes(time) && tempFocus === person.name).map(person => person.name)
                          : people.filter(person => person.availability.includes(time) && filteredPeople.includes(person.name)).map(person => person.name);

    										return (
    											<Time
    												key={i}
    												time={time}
    												className="time"
    												peopleCount={focusCount !== null && focusCount !== peopleHere.length ? 0 : peopleHere.length}
    												aria-label={peopleHere.join(', ')}
    												maxPeople={tempFocus !== null ? 1 : Math.min(max, filteredPeople.length)}
    												minPeople={tempFocus !== null ? 0 : Math.min(min, filteredPeople.length)}
    												onMouseEnter={(e) => {
    													const cellBox = e.currentTarget.getBoundingClientRect();
    													const wrapperBox = wrapper?.current?.getBoundingClientRect() ?? { x: 0, y: 0 };
                              const timeText = timeFormat === '12h' ? 'h:mma' : 'HH:mm';
    													setTooltip({
    														x: Math.round(cellBox.x-wrapperBox.x + cellBox.width/2),
    														y: Math.round(cellBox.y-wrapperBox.y + cellBox.height)+6,
    														available: `${peopleHere.length} / ${people.length} available`,
    														date: parsedDate.hour(time.slice(0, 2)).minute(time.slice(2, 4)).format(isSpecificDates ? `${timeText} ddd, D MMM YYYY` : `${timeText} ddd`),
    														people: peopleHere,
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
              {!!filteredPeople.length && (
      					<TooltipContent>
                  {tooltip.people.map(person =>
                    <TooltipPerson key={person}>{person}</TooltipPerson>
                  )}
                  {filteredPeople.filter(p => !tooltip.people.includes(p)).map(person =>
                    <TooltipPerson key={person} disabled>{person}</TooltipPerson>
                  )}
                </TooltipContent>
              )}
    				</Tooltip>
    			)}
        </ScrollWrapper>
  		</Wrapper>
    </>
	);
};

export default AvailabilityViewer;
