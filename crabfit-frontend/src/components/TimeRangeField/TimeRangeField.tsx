import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';

import { useSettingsStore } from 'stores';

import {
	Wrapper,
	StyledLabel,
	StyledSubLabel,
	Range,
	Handle,
	Selected,
} from './timeRangeFieldStyle';

const times = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];

const TimeRangeField = ({
	label,
	subLabel,
	id,
	register,
	...props
}) => {
  const timeFormat = useSettingsStore(state => state.timeFormat);

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
					label={timeFormat === '24h' ? times[start] : dayjs().hour(times[start]).format('ha')}
          extraPadding={end - start === 1 ? 'padding-right: 20px;' : (start - end === 1 ? 'padding-left: 20px;' : '')}
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
					label={timeFormat === '24h' ? times[end] : dayjs().hour(times[end]).format('ha')}
          extraPadding={end - start === 1 ? 'padding-left: 20px;' : (start - end === 1 ? 'padding-right: 20px;' : '')}
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
