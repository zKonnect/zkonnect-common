const fetchVerificationData = async (
  onRequestUrlReceived: (url: string) => void,
  provider: string,
  onEventSourceReceived: (eventSource: EventSource) => void,
) => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `${window.location.origin}/api/reclaim?provider=${provider.toLowerCase()}`,
    );

    onEventSourceReceived(eventSource);

    const handleMessage = (event: any) => {
      const data = JSON.parse(event.data);
      onRequestUrlReceived(data.requestUrl);
      // Check if the data is valid (verified or JWT is present)
      if (data.verified || data.jwt) {
        resolve(data);
        eventSource.close();
        return { verified: true, jwt: data.jwt };
      }
    };

    eventSource.onmessage = handleMessage;

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      reject(error);
      eventSource.close();
    };
  });
};

export default fetchVerificationData;
