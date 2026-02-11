export default function Loading() {
  return (
    <div className="p-5 md:p-10 space-y-6 md:space-y-8 min-w-0 animate-pulse">
      <div>
        <div className="bg-warm rounded-lg h-9 w-36" />
        <div className="bg-warm rounded-md h-5 w-24 mt-1" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-bg p-4 md:p-6">
            <div className="bg-warm rounded-md h-9 w-12" />
            <div className="bg-warm rounded-md h-3 w-20 mt-2" />
            <div className="bg-warm rounded-md h-3.5 w-10 mt-1.5" />
          </div>
        ))}
      </div>

      <div>
        <div className="bg-warm rounded-md h-6 w-32 mb-4" />
        <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {[0.6, 0.8, 0.5, 0.7, 0.45].map((w, i) => (
            <div
              key={i}
              className="px-4 md:px-5 py-3 md:py-4 flex items-center gap-2 md:gap-3"
            >
              <div className="hidden md:block bg-warm rounded-md h-4 w-14" />
              <div className="bg-warm rounded-md h-4 w-8 shrink-0" />
              <div
                className="bg-warm rounded-md h-4 flex-1"
                style={{ maxWidth: `${w * 100}%` }}
              />
              <div className="hidden md:flex gap-1.5 shrink-0">
                <div className="bg-warm rounded-full h-5 w-14" />
                <div className="bg-warm rounded-full h-5 w-10" />
              </div>
              <div className="bg-warm rounded-md h-3 w-8 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
