'use client';
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import CatCard from '../components/CatCard/CatCard';
import { AppCatImage } from '../utils/CatModel';
import { getCatImageId, getCatImageIdAndFavouriteId, FavouriteIdImageId } from '../utils/FavouritesModel';
import { tranformApiCatsToAppCats } from '../utils/CatModel';
import styles from './Favourites.module.css';

const FavouritesPage = () => {
    const [favourites, setFavourites] = useState<string[]>([]);
    const [catImageData, setCatImageData] = useState<AppCatImage[]>([]);
    const [favouritesLoading, setFavouritesLoading] = useState(false);
    const [favouritesError, setFavouritesError] = useState<string | null>(null);
    const [fetchCatDataLoading, setFetchCatDataLoading] = useState(false);
    const [fetchCatError, setFetchCatError] = useState<string | null>(null);
    const [imageFavourites, setImageFavourites] = useState<FavouriteIdImageId[]>()

    // Fetch favourite cat image IDs
    useEffect(() => {
        const fetchFavourites = async () => {
            setFavouritesLoading(true);
            setFavouritesError(null);
            try {
                const response = await fetch(
                    'https://api.thecatapi.com/v1/favourites?limit=20&sub_id=EwaMuezza&order=DESC',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
                        },
                    }
                );
                // console.log('fetchFavourites response', response)

                if (!response.ok) {
                    throw new Error('Failed to fetch favourites');
                }

                const data = await response.json();
                console.log('fetchFavourites data', data)
                const transformedData = getCatImageId(data); // Get imageIds
                const favouritesData = getCatImageIdAndFavouriteId(data)
                setImageFavourites(favouritesData) //get favouriteId and imageId
                setFavourites(transformedData);
            } catch (err) {
                setFavouritesError('Error fetching favourites');
                console.error('Error fetching favourites:', err);
            } finally {
                setFavouritesLoading(false);
            }
        };

        fetchFavourites();
    }, []);
    // console.log('favourites', favourites)
    // Fetch full cat data using image IDs
    useEffect(() => {
        const fetchCatData = async () => {
            if (favourites.length > 0 && imageFavourites) {
                setFetchCatDataLoading(true);
                // let imageFavourite: ImageFavourite
                try {
                    const catPromises = favourites.map((imageId) =>
                        fetch(`https://api.thecatapi.com/v1/images/${imageId}`, {
                            headers: {
                                'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
                            },
                        }).then((res) => res.json())
                    );

                    const catData = await Promise.all(catPromises);
                    console.log('favourite catData', catData)
                    const tranformedCats = tranformApiCatsToAppCats(catData, imageFavourites); // Pass favourites here
                    setCatImageData(tranformedCats);
                } catch (err) {
                    setFetchCatError('Error fetching cat data');
                    console.error('Error fetching cat data:', err);
                } finally {
                    setFetchCatDataLoading(false);
                }
            }
        };

        fetchCatData();
    }, [favourites, imageFavourites]);

    if (favouritesLoading) {
        return <div><CircularProgress /><span>Favourite cats loading...</span></div>;
    }

    if (favouritesError) {
        return <div>{favouritesError}</div>;
    }

    if (catImageData.length === 0) {
        return <p className={styles['no-favourites']}>No favourites yet!</p>;
    }

    if (fetchCatDataLoading) return <div><CircularProgress /><span>Loading...</span></div>;
    if (fetchCatError) {
        return <div>{fetchCatError}</div>;
    }

    return (
        <div className={styles['favourites-container']}>
            {catImageData.map((cat) => (
                <CatCard
                    isOnFavouritesPage={false}
                    key={`cat${cat.imageId}`}
                    cat={cat}
                />
            ))}
        </div>
    );

};

export default FavouritesPage;
