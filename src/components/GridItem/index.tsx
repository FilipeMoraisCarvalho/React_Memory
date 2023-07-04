import { GridItemType } from "../../types/GridItemType";
import * as C from "./styles"
import { items } from "../../data/items";
import B7web from "../../svgs/b7.svg";

type Props = {
    item: GridItemType
    onClick: () => void
}

export const GridItem = ({item, onClick}: Props) => {
    return(
        <C.Container 
            showBackground={item.permanentShown || item.shown}
            onClick={onClick}>
           {item.permanentShown === false && item.shown === false &&
                <C.icon src={B7web} opacity={0.1}/>
                 
           }
           {(item.permanentShown || item.shown) && item.item !== null &&
                <C.icon src={items[item.item].icon}/>
                    
                
           
           }
        </C.Container>
    );
}