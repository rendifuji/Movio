import { useParams } from "react-router";

const BookSeats = () => {
  const { movieId } = useParams<{ movieId: string }>();
  return <div>Book Seats — Movie ID: {movieId}</div>;
};

export default BookSeats;
