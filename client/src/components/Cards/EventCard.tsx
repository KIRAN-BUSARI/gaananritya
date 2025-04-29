import { FC } from 'react';

interface EventCardProps {
  image: string;
  title: string;
  location: string;
  date: string;
  timings: string;
  category?: string;
}

const EventCard: FC<EventCardProps> = ({
  image,
  title,
  location,
  date,
  timings,
}) => {
  return (
    <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="relative h-40 w-full overflow-hidden sm:h-48 md:h-[350px]">
        <img
          src={typeof image === 'string' ? image : image[0]}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{timings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
