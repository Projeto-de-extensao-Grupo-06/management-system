import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface ExpandMaterialProps {
    name: string;
    description: string | null;
}

export default function ExpandMaterial({name, description}: ExpandMaterialProps) {
    const [isExpand, setExpand] = useState(false);

    function handleExpand() {
        setExpand(!isExpand);
    }

    return (
        <tr>
            <td>{name}</td>
            <td>{description}</td>
            <td onClick={handleExpand}>
              <FontAwesomeIcon
                icon={isExpand ? faCaretDown : faCaretUp}
                size="xl"
                cursor="pointer"
              />
            </td>
          </tr>
    );
}