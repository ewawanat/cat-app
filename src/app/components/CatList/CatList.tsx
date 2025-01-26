import { AppCatImage } from '../../utils/CatModel';
import CatCard from '../CatCard/CatCard';
import styles from './CatList.module.css';

type CatListProps = {
    catListData: AppCatImage[];
    // onAddFavourite: (imageId: string, favouriteId: string) => void;
    favourites: AppCatImage[];
    // onRemoveFavourite: (favouriteId: string) => void;
};

const CatList = ({ catListData, favourites }: CatListProps) => {
    console.log('cat list favourites', favourites)
    const catCards = catListData.map((cat) => {
        return (
            <CatCard
                key={cat.imageId}
                cat={cat}

            />
        );
    });

    return <div className={styles['cat-list-container']}>{catCards}</div>;
};

export default CatList;
