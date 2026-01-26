const MessageSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Received message skeleton */}
      <div className="flex gap-2.5 items-end">
        <div className="skeleton w-8 h-8 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-1">
          <div className="skeleton h-12 w-48 rounded-2xl rounded-bl-md"></div>
          <div className="skeleton h-3 w-12 ml-1"></div>
        </div>
      </div>

      {/* Sent message skeleton */}
      <div className="flex gap-2.5 items-end justify-end">
        <div className="flex flex-col gap-1 items-end">
          <div className="skeleton h-10 w-36 rounded-2xl rounded-br-md"></div>
          <div className="skeleton h-3 w-12 mr-1"></div>
        </div>
        <div className="skeleton w-8 h-8 rounded-full shrink-0"></div>
      </div>

      {/* Another received message skeleton */}
      <div className="flex gap-2.5 items-end">
        <div className="skeleton w-8 h-8 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-1">
          <div className="skeleton h-16 w-56 rounded-2xl rounded-bl-md"></div>
          <div className="skeleton h-3 w-12 ml-1"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
