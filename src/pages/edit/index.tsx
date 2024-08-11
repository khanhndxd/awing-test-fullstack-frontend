import { useParams } from "react-router-dom";
import InputComponent from "../../components/input";

export default function Edit() {
  const { id } = useParams();
  return <InputComponent id={Number(id)} />;
}
