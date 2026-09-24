import React, { useState } from 'react';

export interface ReviewCardProps {
  avatar: string;
  name: string;
  city: string;
  rating?: number;
  comment: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  avatar,
  name,
  city,
  rating = 5,
  comment,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E7E0D0] p-5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          {imgError ? (
            <div className="w-10 h-10 rounded-full bg-[#1F4D2E] text-[#D9A441] font-bold text-xs flex items-center justify-center shrink-0 border border-[#D9A441]/40">
              {name.charAt(0)}
            </div>
          ) : (
            <img
              src={avatar}
              alt={name}
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-full object-cover border border-[#E7E0D0] shrink-0"
            />
          )}
          <div>
            <div className="flex text-[#D9A441] text-xs">
              {[...Array(rating)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <h4 className="font-bold text-xs text-gray-900 leading-tight">
              {name}, <span className="text-gray-500 font-normal">{city}</span>
            </h4>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed italic">
          "{comment}"
        </p>
      </div>
    </div>
  );
};
