type Image = {
    id: string; // ID of the image
    url: string;

}
export type Vote = {
    id: number;
    image_id: string;
    sub_id: string | null;
    created_at: string;
    value: number;
    country_code: string;
    image: Image;
};

export type AppCatVotes = {
    imageId: string;
    votes: number;
}
export const getCatVotes = (apiCatVotesData: Vote[]): AppCatVotes[] => {
    return apiCatVotesData.map((aCatVotesData) => ({
        imageId: aCatVotesData.image_id,
        votes: aCatVotesData.value,
    }))
}