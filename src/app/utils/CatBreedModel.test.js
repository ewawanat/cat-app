import { transformBreedData } from './CatBreedModel';

describe('transformBreedData', () => {
    it('transforms ApiCatBreedData into AppCatBreedDetails correctly', () => {
        const apiCatBreedData = {
            weight: {
                imperial: '8 - 15',
                metric: '4 - 7',
            },
            id: 'beng',
            name: 'Bengal',
            cfa_url: 'https://cfa.org/bengal',
            vetstreet_url: 'https://www.vetstreet.com/cats/bengal',
            vcahospitals_url: 'https://vcahospitals.com/know-your-pet/cat-breeds/bengal',
            temperament: 'Alert, Agile, Energetic, Demanding, Intelligent',
            origin: 'United States',
            country_codes: 'US',
            country_code: 'US',
            description: 'Bengals are highly active and love to play.',
            life_span: '12 - 16',
            indoor: 0,
            lap: 1,
            alt_names: 'Miniature Leopard',
            adaptability: 5,
            affection_level: 5,
            child_friendly: 4,
            dog_friendly: 5,
            energy_level: 5,
            grooming: 1,
            health_issues: 3,
            intelligence: 5,
            shedding_level: 3,
            social_needs: 5,
            stranger_friendly: 5,
            vocalisation: 4,
            experimental: 0,
            hairless: 0,
            natural: 1,
            rare: 0,
            rex: 0,
            suppressed_tail: 0,
            short_legs: 0,
            wikipedia_url: 'https://en.wikipedia.org/wiki/Bengal_(cat)',
            hypoallergenic: 1,
            reference_image_id: 'O3btzLlsO',
        };

        const expectedTransformedData = {
            name: 'Bengal',
            image: 'https://cdn2.thecatapi.com/images/O3btzLlsO.jpg',
            lifeSpan: '12 - 16',
            weight: {
                imperial: '8 - 15',
                metric: '4 - 7',
            },
            description: 'Bengals are highly active and love to play.',
        };

        const result = transformBreedData(apiCatBreedData);

        expect(result).toEqual(expectedTransformedData);
    });

    it('handles missing reference_image_id gracefully', () => {
        const apiCatBreedData = {
            weight: {
                imperial: '8 - 15',
                metric: '4 - 7',
            },
            id: 'beng',
            name: 'Bengal',
            cfa_url: 'https://cfa.org/bengal',
            vetstreet_url: 'https://www.vetstreet.com/cats/bengal',
            vcahospitals_url: 'https://vcahospitals.com/know-your-pet/cat-breeds/bengal',
            temperament: 'Alert, Agile, Energetic, Demanding, Intelligent',
            origin: 'United States',
            country_codes: 'US',
            country_code: 'US',
            description: 'Bengals are highly active and love to play.',
            life_span: '12 - 16',
            indoor: 0,
            lap: 1,
            alt_names: 'Miniature Leopard',
            adaptability: 5,
            affection_level: 5,
            child_friendly: 4,
            dog_friendly: 5,
            energy_level: 5,
            grooming: 1,
            health_issues: 3,
            intelligence: 5,
            shedding_level: 3,
            social_needs: 5,
            stranger_friendly: 5,
            vocalisation: 4,
            experimental: 0,
            hairless: 0,
            natural: 1,
            rare: 0,
            rex: 0,
            suppressed_tail: 0,
            short_legs: 0,
            wikipedia_url: 'https://en.wikipedia.org/wiki/Bengal_(cat)',
            hypoallergenic: 1,
        };

        const expectedTransformedData = {
            name: 'Bengal',
            image: 'https://cdn2.thecatapi.com/images/undefined.jpg',
            lifeSpan: '12 - 16',
            weight: {
                imperial: '8 - 15',
                metric: '4 - 7',
            },
            description: 'Bengals are highly active and love to play.',
        };

        const result = transformBreedData(apiCatBreedData);

        expect(result).toEqual(expectedTransformedData);
    });
});
