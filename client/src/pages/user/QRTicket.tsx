import React from 'react';
import { FaArrowLeft, FaClock, FaFilm, FaCalendarAlt, FaDownload } from 'react-icons/fa';

interface MovieTicketProps {
  title: string;
  duration: string;
  genre: string;
  rating: string;
  date: string;
  time: string;
  seatCount: number;
  seatNumbers: string[];
  ticketId: string;
}

const MovieTicket: React.FC<MovieTicketProps> = ({
  title,
  duration,
  genre,
  rating,
  date,
  time,
  seatCount,
  seatNumbers,
  ticketId,
}) => {

  const qrData = `Ticket:${title}|Date:${date}|Seats:${seatNumbers.join(',')}|ID:${ticketId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (

    <div className="min-h-screen bg-[#050914] flex items-center justify-center font-sans text-white p-4 relative">

      <button 
        onClick={() => window.history.back()}
        className="absolute top-8 left-8 md:top-12 md:left-20 w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors text-white"
      >
        <FaArrowLeft />
      </button>

      <div className="bg-[#0b1221] w-full max-w-[750px] md:h-[400px] rounded-[20px] p-8 md:p-10 flex flex-col md:flex-row shadow-2xl border border-slate-800 relative">

        <div className="flex-1.5 flex flex-col justify-center md:pr-6 md:border-r border-slate-800 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

          <div className="flex items-center gap-4 text-slate-400 text-sm mb-8">
            <div className="flex items-center gap-2">
              <FaClock /> {duration}
            </div>
            <div className="flex items-center gap-2">
              <FaFilm /> {genre}
            </div>
            <span className="bg-green-400 text-black px-2 py-0.5 rounded font-bold text-xs">
              {rating}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4 text-slate-300">
            <FaCalendarAlt className="text-slate-500" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-4 mb-4 text-slate-300">
            <FaClock className="text-slate-500" />
            <span>{time}</span>
          </div>

          <div className="mt-2 text-lg">
            <span className="font-semibold text-white">{seatCount} Seats</span>
            <span className="text-slate-500 ml-2 text-sm">– {seatNumbers.join(', ')}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center md:pl-6">
          <div className="bg-white p-4 rounded-xl mb-6">
            <img 
              src={qrUrl} 
              alt="QR Code" 
              className="w-40 h-40 object-contain block"
            />
          </div>
          
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
            <FaDownload /> Download
          </button>
        </div>

      </div>
    </div>
  );
};

export default MovieTicket;