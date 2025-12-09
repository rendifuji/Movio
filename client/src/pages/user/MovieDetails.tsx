import { useParams } from "react-router";

const MovieDetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  return <div>Movie Details — ID: {movieId}</div>;
};

export default MovieDetails;
