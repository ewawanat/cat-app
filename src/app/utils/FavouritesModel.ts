
type FavouriteImage = {
    imageId: string; // ID of the image
}
export type ApiFavouriteCat = {
    id: number; // Unique ID for the favourite
    user_id: string; // User ID associated with the favourite
    image_id: string; // ID of the image
    sub_id: string; // Optional sub ID, e.g., for user identification
    created_at: string; // ISO date string for when the favourite was created
    image: FavouriteImage;
}

export type FavouriteIdImageId = {
    favouriteId: string,
    imageId: string,
}
export const getCatImageId = (apiFavouriteCats: ApiFavouriteCat[]): string[] => {
    return apiFavouriteCats.map(aCat => aCat.image_id)
}
export const getCatImageIdAndFavouriteId = (apiFavouriteCats: ApiFavouriteCat[]): FavouriteIdImageId[] => {
    return apiFavouriteCats.map((aCat) => ({
        favouriteId: aCat.id.toString(),
        imageId: aCat.image_id,
    }))
}