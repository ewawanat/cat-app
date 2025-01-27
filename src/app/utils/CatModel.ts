import { FavouriteIdImageId } from '../utils/FavouritesModel';
export type AppCatImage = {
    imageId: string,
    url: string,
    imageWidth: number,
    imageHeight: number,
    favouriteId?: string,
    votes: number,
}

export type ApiCatImage = {
    id: string,
    url: string,
    width: number,
    height: number,
    favouriteId?: string,
    votes?: number,
}

export const tranformApiCatsToAppCats = (apiCats: ApiCatImage[], imageFavourites?: FavouriteIdImageId[]): AppCatImage[] => {
    return apiCats.map((apiCat) => {
        // Find a matching favourite for the current cat
        const matchingFavourite = imageFavourites?.find((fav) => fav.imageId === apiCat.id);
        return {
            imageId: apiCat.id,
            url: apiCat.url,
            imageWidth: apiCat.width,
            imageHeight: apiCat.height,
            favouriteId: matchingFavourite ? matchingFavourite.favouriteId : '', // Set favouriteId if a match is found
            votes: apiCat.votes ? apiCat.votes : 0,
        };
    });
};

