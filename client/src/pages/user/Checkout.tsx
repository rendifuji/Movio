import { useParams } from "react-router";

const Checkout = () => {
  const { movieId } = useParams<{ movieId: string }>();
  return <div>Checkout — Movie ID: {movieId}</div>;
};

export default Checkout;
