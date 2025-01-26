'use client'
import { useState, useReducer } from 'react'
import Image from "next/image"
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Typography from '@mui/material/Typography';
import { AppCatImage } from '../../utils/CatModel'
import { catReducer } from '@/app/reducers/catReducer';
import styles from './CatCard.module.css';

type CatCardProps = {
    cat: AppCatImage;
    onAddFavourite: (imageId: string, favouriteId: string) => void;
    onRemoveFavourite: (imageId: string) => void;
}

const CatCard = ({ cat, onAddFavourite, onRemoveFavourite }: CatCardProps) => {
    const [votes, setVotes] = useState<number>(cat.votes);

    const [addFavouriteError, setAddFavouriteError] = useState<string | null>(null);
    const [addFavouriteLoading, setAddFavouriteLoading] = useState<boolean>(false);

    const [removeFavouriteError, setRemoveFavouriteError] = useState<string | null>(null);
    const [removeFavouriteLoading, setRemoveFavouriteLoading] = useState<boolean>(false);
    const [cats, dispatch] = useReducer(catReducer, [cat]);

    const addFavourite = async (cat: AppCatImage) => {
        setAddFavouriteLoading(true)
        try {
            const requestBody = JSON.stringify({
                image_id: cat.imageId,
                sub_id: 'EwaMuezza',
            });

            const response = await fetch('https://api.thecatapi.com/v1/favourites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
                },
                body: requestBody,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add favourite. Status: ${response.status}. ${errorText}`);
            }

            const data = await response.json();
            console.log('faves data', data);

            if (data.message === 'SUCCESS') {
                // Dispatch the ADD_FAVOURITE action to update the state
                dispatch({
                    type: 'ADD_FAVOURITE',
                    payload: { imageId: cat.imageId, favouriteId: data.id },
                });

                // onAddFavourite(cat.imageId, data.id); // Pass favouriteId to parent
            }
        } catch (error) {
            console.error('Error adding favourite:', error);
            setAddFavouriteError('There was an issue adding the cat to your favourites.');
        }
        finally {
            setAddFavouriteLoading(false)
        }
    };

    const removeFavourite = async (favouriteId: string) => {
        setRemoveFavouriteLoading(true)
        try {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
                },
            };

            const response = await fetch(`https://api.thecatapi.com/v1/favourites/${favouriteId}`, requestOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to remove favourite. Status: ${response.status}. ${errorText}`);
            }

            const data = await response.json();
            console.log('Removed favourite:', data);
            if (data.message === 'SUCCESS' && cat.favouriteId) {
                dispatch({
                    type: 'REMOVE_FAVOURITE',
                    payload: { favouriteId: data.id },
                });
            }
        } catch (error) {
            console.error('Error removing favourite:', error);
            setRemoveFavouriteError('There was an issue removing the cat from your favourites.');
        } finally {
            setRemoveFavouriteLoading(false)
        }
    };

    const toggleFavorite = () => {
        if (cat.favouriteId) {
            removeFavourite(cat.favouriteId || ''); // Pass the favouriteId to remove
        } else {
            addFavourite(cat);
        }
    };
    const handleVote = async (type: 'up' | 'down') => {
        try {
            const requestBody = JSON.stringify({
                image_id: cat.imageId,
                sub_id: 'EwaMuezza',
                value: type === 'up' ? 1 : 0,
            });

            const response = await fetch('https://api.thecatapi.com/v1/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
                },
                body: requestBody,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to cast vote. Status: ${response.status}. ${errorText}`);
            }

            const data = await response.json();
            console.log('Vote data:', data);
            dispatch({
                type: type === 'up' ? 'VOTE_UP' : 'VOTE_DOWN',
                payload: { imageId: cat.imageId },
            });
            // Update local state for votes
            setVotes((prevVotes) => (type === 'up' ? prevVotes + 1 : prevVotes - 1));
        } catch (error) {
            console.error('Error casting vote:', error);
        }
    };

    if (removeFavouriteLoading) return <div><CircularProgress /><span>Loading...</span></div>;
    if (removeFavouriteError) {
        return <div>{removeFavouriteError}</div>;
    }
    if (addFavouriteLoading) return <div><CircularProgress /><span>Loading...</span></div>;
    if (addFavouriteError) {
        return <div>{addFavouriteError}</div>;
    }
    const currentCat = cats[0]; // Since we're only dealing with one cat here, we can safely access the first element

    return (
        <div className={styles['cat-card-container']}>
            <Link
                href={{
                    pathname: `/breeds/${cat.imageId}`,
                    query: {
                        width: currentCat.imageWidth,
                        height: currentCat.imageHeight,
                        image: currentCat.url,
                    },
                }}
            >
                <Image alt='Image of a cat' src={currentCat.url} width={currentCat.imageWidth} height={currentCat.imageHeight} className={styles['image-fit']} />
            </Link>
            <div className={styles['actions-container']}>
                <>{currentCat.imageId}</>
                <IconButton onClick={toggleFavorite}>
                    {currentCat.favouriteId ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={() => handleVote('up')}>
                    <ThumbUpIcon />
                    <Typography variant='body2' ml={1}>Vote Up</Typography>
                </IconButton>
                <IconButton onClick={() => handleVote('down')}>
                    <ThumbDownIcon />
                    <Typography variant='body2' ml={1}>Vote Down</Typography>
                </IconButton>
            </div>
            <div className={styles['votes-container']}>
                <Typography variant='body2'>Votes: {votes}</Typography>
            </div>
        </div>
    );
}

export default CatCard;
