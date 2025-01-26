'use client';
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { transformBreedData, AppCatBreedDetails, ApiCatBreedData } from '@/app/utils/CatBreedModel';
import styles from './CatBreedSelector.module.css'

type CatBreedSelectorProps = {
    onBreedSelect: (breedId: string | null) => void;
};

const CatBreedSelector: React.FC<CatBreedSelectorProps> = ({ onBreedSelect }) => {
    const [breeds, setBreeds] = useState<AppCatBreedDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBreeds = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api.thecatapi.com/v1/breeds', {
                    headers: {
                        'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
                    },
                });
                const breedData = await response.json();
                console.log('breed data', breedData)
                const transformedBreeds = breedData.map((aBreed: ApiCatBreedData) => transformBreedData(aBreed))
                setBreeds(transformedBreeds)
            } catch (error) {
                console.error('Error fetching breeds:', error); //TODO in a real app, log it somewhere useful
                setError('Failed to fetch breeds')
            } finally {
                setLoading(false);
            }
        };

        fetchBreeds();
    }, []);
    const handleChange = (_event: React.SyntheticEvent, value: AppCatBreedDetails | null) => {
        onBreedSelect(value ? value.id : null);
    };
    if (error) return <div>Ooops the cat brees escaped! Please try to catch them again later.</div>

    return (
        <Autocomplete
            className={styles['autocomplete']}
            options={breeds}
            getOptionLabel={(option) => option.name}
            loading={loading}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label='Select Cat Breed' variant='filled' />}
        />
    );
}
export default CatBreedSelector