export const formatEventTime = (eventTime: Date): string => {
  const currentTime = new Date();
  const eventDateTime = new Date(eventTime);
  const timeDifference = eventDateTime.getTime() - currentTime.getTime();

  if (timeDifference > 0) {
    // Event is in the future
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );
    return `Starts in ${hours}h ${minutes}min`;
  } else {
    // Event has passed
    return `Event ended on ${eventDateTime.toLocaleDateString()}`;
  }
};
