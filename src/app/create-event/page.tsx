import EventCreation from "@/components/EventCreation/EventCreation";

const Page = () => {
  return (
    <main>
      <section className="overflow-hidden pt-24">
        <div className="relative mx-auto flex max-w-[1600px] flex-col items-center justify-center space-y-10 px-4 md:px-8 2xl:px-2">
          <div className="space-y-2 text-center">
            <h1 className="font-dmsans text-2xl font-semibold lg:text-3xl">
              Create Event
            </h1>
            <p className="text-sm text-muted-foreground">
              Create Your Event and Let the Fun Begin!
            </p>
          </div>
          <EventCreation />
        </div>
      </section>
    </main>
  );
};

export default Page;
