import EventCreation from "@/components/EventCreation/EventCreation";

const Page = () => {
  return (
    <main>
      <section className="overflow-hidden pt-36 md:pt-40 xl:pb-25 xl:pt-46">
        <div className="relative mx-auto flex max-w-[1600px] flex-col items-center justify-center space-y-10 px-4 md:px-8 2xl:px-2">
          <h1 className="font-dmsans text-4xl font-semibold">Create Event</h1>
          <EventCreation />
        </div>
      </section>
    </main>
  );
};

export default Page;
