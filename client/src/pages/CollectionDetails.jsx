import { useLocation } from "react-router"

const CollectionDetails = () => {
    const path = useLocation().pathname;
    const playlistId = path.split("/").at(-1);

    return (
        <div className=''>{playlistId}</div>
    )
}

export default CollectionDetails