
export type ApiCatBreedData = {
    weight: {
        imperial: string;
        metric: string;
    };
    id: string;
    name: string;
    cfa_url: string;
    vetstreet_url: string;
    vcahospitals_url: string;
    temperament: string;
    origin: string;
    country_codes: string;
    country_code: string;
    description: string;
    life_span: string;
    indoor: number;
    lap: number;
    alt_names: string;
    adaptability: number;
    affection_level: number;
    child_friendly: number;
    dog_friendly: number;
    energy_level: number;
    grooming: number;
    health_issues: number;
    intelligence: number;
    shedding_level: number;
    social_needs: number;
    stranger_friendly: number;
    vocalisation: number;
    experimental: number;
    hairless: number;
    natural: number;
    rare: number;
    rex: number;
    suppressed_tail: number;
    short_legs: number;
    wikipedia_url: string;
    hypoallergenic: number;
    reference_image_id?: string;
};

type Weight = {
    imperial: string;
    metric: string;
}

export type AppCatBreedDetails = {
    id: string;
    name: string;
    image: string;
    lifeSpan: string;
    weight: Weight;
    description: string;
};

export const transformBreedData = (data: ApiCatBreedData): AppCatBreedDetails => {
    return {
        id: data.id,
        name: data.name,
        image: `https://cdn2.thecatapi.com/images/${data.reference_image_id}.jpg`,
        lifeSpan: data.life_span,
        weight: {
            imperial: data.weight.imperial,
            metric: data.weight.metric
        },
        description: data.description
    };
};

export type ApiCatListData = {
    breed: ApiCatBreedData;
    id: string;
    url: string;
    width: string;
    height: string;
}
