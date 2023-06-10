/**
 * Takes times as strings that start with `HH00-`, and adds 15, 30 and 45 minute variants
 */
export const expandTimes = (times: string[]) =>
  times.flatMap(time => {
    const [hour, rest] = [time.substring(0, 2), time.substring(4)]
    return [
      `${hour}00${rest}`,
      `${hour}15${rest}`,
      `${hour}30${rest}`,
      `${hour}45${rest}`,
    ]
  })
