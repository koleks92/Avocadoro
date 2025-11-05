import { useParams } from "react-router-dom";

export default function Group() {
    const { id } = useParams<{ id: string }>();

    return <div>Group {id}</div>;
}
