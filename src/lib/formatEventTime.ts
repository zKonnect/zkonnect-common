export const formatEventTime = (eventTime: Date): string => {
  const currentTime = new Date();
  const eventDateTime = new Date(eventTime);
  const timeDifference = eventDateTime.getTime() - currentTime.getTime();

  if (timeDifference > 0) {
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );
    return `Starts in ${hours}h ${minutes}min`;
  } else {
    return `Event ended on ${eventDateTime.toLocaleDateString()}`;
  }
};

export function formatDate(dateString: Date): string {
  const date = new Date(dateString);
  const now = new Date();

  const prefix = date > now ? "Starts on" : "Ended on";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return `${prefix} ${date.toLocaleString("en-US", options).replace(",", " at")}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursString = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""}` : "";
  const minutesString =
    remainingMinutes > 0
      ? `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`
      : "";
  return [hoursString, minutesString].filter(Boolean).join(" ");
}
