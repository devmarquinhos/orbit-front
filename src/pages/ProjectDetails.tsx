import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();
  return <h1 className="text-2xl font-bold">Projeto {id}</h1>;
}
