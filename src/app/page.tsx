'use client';

import React, { useState, useEffect, useReducer, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import { tranformApiCatsToAppCats } from './utils/CatModel';
import { getCatVotes, AppCatVotes } from './utils/CatVotesModel'
import { catReducer } from './reducers/catReducer';
import CatList from '../app/components/CatList/CatList';
import CatBreedSelector from '../app/components/CatBreedSelector/CatBreedSelector';
import styles from './page.module.css';

const HomePage = () => {
  const [catData, dispatch] = useReducer(catReducer, []);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [loadingCatData, setLoadingCatData] = useState<boolean>(false);
  const [fetchCatDataError, setFetchCatDataError] = useState<string | null>(null);
  const [votes, setVotes] = useState<AppCatVotes[]>([]);
  const [votesLoading, setVotesLoading] = useState<boolean>(false);
  const [votesError, setVotesError] = useState<string | null>(null);
  // Fetch cat data based on the selected breed
  const fetchCatData = async (breedId: string | null) => {
    setLoadingCatData(true);
    try {
      const url = breedId
        ? `https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1&breed_ids=${breedId}`
        : `https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1`;
      const response = await fetch(url, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('Fetched cat data:', data);
      const transformedCats = tranformApiCatsToAppCats(data);
      dispatch({ type: 'SET_CATS', payload: transformedCats });
    } catch (error) {
      console.error('Error fetching cat data:', error);
      setFetchCatDataError('Failed to fetch cats. Please try again later.');
    } finally {
      setLoadingCatData(false);
    }
  };

  useEffect(() => {
    fetchCatData(selectedBreed);
  }, [selectedBreed]);

  // Handle breed selection
  const handleBreedSelect = (breedId: string | null) => {
    setSelectedBreed(breedId);
  };

  // Fetch votes for cats
  useEffect(() => {
    const fetchVotesForCats = async () => {
      setVotesLoading(true)
      try {
        const response = await fetch(`https://api.thecatapi.com/v1/votes`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error fetching votes:', errorText);
          return [];
        }
        const data = await response.json();
        console.log('votes data', data);
        const tranformedVotesData = getCatVotes(data)
        setVotes(tranformedVotesData)
      } catch (error) {
        setVotesError('Could not load votes')
        console.error('Error fetching votes:', error);
      } finally {
        setVotesLoading(false)
      }
    };
    fetchVotesForCats()
  }, [])

  const mappedCatsWithVotes = useMemo(() => {
    if (catData.length === 0 || votes.length === 0) return catData;

    return catData.map((cat) => {
      const catVotes = votes.find((vote) => vote.imageId === cat.imageId);
      return {
        ...cat,
        votes: catVotes ? catVotes.votes : 0, // Set votes or default to 0
      };
    });
  }, [catData, votes]); // Only recompute when catData or votes change

  // Handle adding a favourite
  // const handleAddFavourite = (imageId: string, favouriteId: string) => {
  //   dispatch({ type: 'ADD_FAVOURITE', payload: { imageId, favouriteId } });
  // };
  // const handleRemoveFavourite = (favouriteId: string) => {
  //   dispatch({
  //     type: 'REMOVE_FAVOURITE',
  //     payload: { favouriteId },
  //   });
  // };

  return (
    <div className={styles.page}>
      <Typography variant='h4' gutterBottom>
        Cat Images
      </Typography>
      <CatBreedSelector onBreedSelect={handleBreedSelect} />

      <CatList catListData={mappedCatsWithVotes} favourites={catData.filter((cat) => cat.favouriteId)} />
      {loadingCatData && (
        <div className={styles['spinner-container']}>
          <Typography variant='h6'>Fetching your cats...</Typography>
          <CircularProgress />
        </div>
      )}
      {fetchCatDataError && (
        <Typography color='error'>{fetchCatDataError}</Typography>
      )}
      {votesLoading && (
        <div className={styles['spinner-container']}>
          <Typography variant='h6'>Loading votes..</Typography>
          <CircularProgress />
        </div>
      )}
      {votesError && (
        <Typography color='error'>{votesError}</Typography>
      )}
    </div>
  );
};

export default HomePage;
