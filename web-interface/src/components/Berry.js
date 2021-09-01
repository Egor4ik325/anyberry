import { useParams } from "react-router";

export default function Berry() {
    const { id } = useParams();

    return (
        <div>I'm a berry #{id}.</div>
    );
}