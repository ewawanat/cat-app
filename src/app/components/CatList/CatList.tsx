import { AppCatImage } from '../../utils/CatModel';
import CatCard from '../CatCard/CatCard';
import styles from './CatList.module.css';

type CatListProps = {
    catListData: AppCatImage[];
    votesLoading: boolean
};

const CatList = ({ catListData, votesLoading }: CatListProps) => {
    const catCards = catListData.map((cat) => {
        return (
            <CatCard
                votesLoading={votesLoading}
                isOnFavouritesPage={false}
                key={cat.imageId}
                cat={cat}

            />
        );
    });

    return <div className={styles['cat-list-container']}>{catCards}</div>;
};

export default CatList;
