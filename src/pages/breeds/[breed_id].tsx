'use client';
import '../../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress, Typography } from '@mui/material';
import Image from 'next/image';
import { AppCatBreedDetails, transformBreedData } from '../../app/utils/CatBreedModel';

import styles from './CatBreedCard.module.css'

const BreedDetails = () => {
    const router = useRouter();
    const { breed_id } = router.query;

    const [breedDetails, setBreedDetails] = useState<AppCatBreedDetails>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only fetch data when breed_id is defined
        if (!breed_id) {
            return;
        }

        const fetchBreedDetails = async () => {
            try {
                const response = await fetch(`https://api.thecatapi.com/v1/images/${breed_id}`);

                if (!response.ok) {
                    setError('Error fetching breed details');
                    return;
                }
                const rawData = await response.text();


                const data = JSON.parse(rawData);
                console.log('BREEEDdata', data)
                setBreedDetails(data)
                const transformedData = transformBreedData(data.breeds[0]);
                setBreedDetails(transformedData);
            } catch (err) {
                console.error('Error fetching breed details:', err);
                setError('Error fetching breed details');
            } finally {
                setLoading(false);
            }
        };

        fetchBreedDetails();
    }, [breed_id]);

    if (!breed_id) {
        return (
            <div>
                <Typography variant='h6'>Loading breed information...</Typography>
                <CircularProgress />
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles['spinner-container']}>
                Loading...
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    const imageSrc = breedDetails?.image ? decodeURIComponent(breedDetails?.image) : '/images/placeholder.jpg';

    return (
        <div className={styles['cat-breed-card-container']}>
            {/* {JSON.stringify(breedDetails)} */}
            <div className={styles['left-col']}>
                <Typography variant='h4' component='h1' gutterBottom>
                    {breedDetails?.name || 'Unknown Breed'}
                </Typography>
                <Image
                    src={imageSrc}
                    alt={breedDetails?.name || 'Cat Image'}
                    width={200}
                    height={200}
                    className={styles['image-fit']}
                />
            </div>
            <div className={styles['right-col']}>
                <Typography variant='body1' gutterBottom>
                    {breedDetails?.description || 'No description available.'}
                </Typography>
                <Typography variant='body2' gutterBottom>
                    <strong>Life span:</strong> {breedDetails?.lifeSpan || 'N/A'}
                </Typography>
                <Typography variant='body2'>
                    <strong>Weight:</strong> {breedDetails?.weight?.metric || 'N/A'} kg
                </Typography>
            </div>
        </div>
    );
};

export default BreedDetails;
