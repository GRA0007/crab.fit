import { useState, useEffect, useRef } from 'react';

import {
	Wrapper,
	StyledLabel,
	StyledSubLabel,
	Range,
	Handle,
	Selected,
} from './timeRangeFieldStyle';

const times = [
	'12am',
	'1am',
	'2am',
	'3am',
	'4am',
	'5am',
	'6am',
	'7am',
	'8am',
	'9am',
	'10am',
	'11am',
	'12pm',
	'1pm',
	'2pm',
	'3pm',
	'4pm',
	'5pm',
	'6pm',
	'7pm',
	'8pm',
	'9pm',
	'10pm',
	'11pm',
	'12am',
];

const TimeRangeField = ({
	label,
	subLabel,
	id,
	register,
	...props
}) => {
	const [start, setStart] = useState(9);
	const [end, setEnd] = useState(17);

	const isStartMoving = useRef(false);
	const isEndMoving = useRef(false);
	const rangeRef = useRef();
	const rangeRect = useRef();

	useEffect(() => {
		if (rangeRef.current) {
			rangeRect.current = rangeRef.current.getBoundingClientRect();
		}
	}, [rangeRef]);

	const handleMouseMove = e => {
		if (isStartMoving.current || isEndMoving.current) {
			let step = Math.round(((e.pageX - rangeRect.current.left) / rangeRect.current.width) * 24);
			if (step < 0) step = 0;
			if (step > 24) step = 24;
			step = Math.abs(step);

			if (isStartMoving.current) {
				setStart(step);
			} else if (isEndMoving.current) {
				setEnd(step);
			}
		}
	};

	return (
		<Wrapper>
			{label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
			{subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}
			<input
				id={id}
				type="hidden"
				ref={register}
				value={JSON.stringify({start, end})}
				{...props}
			/>

			<Range ref={rangeRef}>
				<Selected start={start} end={start > end ? 24 : end} />
				{start > end && <Selected start={start > end ? 0 : start} end={end} />}
				<Handle
					value={start}
					label={times[start]}
					onMouseDown={() => {
						document.addEventListener('mousemove', handleMouseMove);
						isStartMoving.current = true;

						document.addEventListener('mouseup', () => {
							isStartMoving.current = false;
							document.removeEventListener('mousemove', handleMouseMove);
						}, { once: true });
					}}
					onTouchMove={(e) => {
						const touch = e.targetTouches[0];

						let step = Math.round(((touch.pageX - rangeRect.current.left) / rangeRect.current.width) * 24);
						if (step < 0) step = 0;
						if (step > 24) step = 24;
						step = Math.abs(step);
						setStart(step);
					}}
				/>
				<Handle
					value={end}
					label={times[end]}
					onMouseDown={() => {
						document.addEventListener('mousemove', handleMouseMove);
						isEndMoving.current = true;

						document.addEventListener('mouseup', () => {
							isEndMoving.current = false;
							document.removeEventListener('mousemove', handleMouseMove);
						}, { once: true });
					}}
					onTouchMove={(e) => {
						const touch = e.targetTouches[0];

						let step = Math.round(((touch.pageX - rangeRect.current.left) / rangeRect.current.width) * 24);
						if (step < 0) step = 0;
						if (step > 24) step = 24;
						step = Math.abs(step);
						setEnd(step);
					}}
				/>
			</Range>
		</Wrapper>
	);
};

export default TimeRangeField;
