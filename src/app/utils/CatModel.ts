// import { AppFavouriteCat } from "./FavouritesModel";

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
}
//favourites is an array of strings for adding pictures later but 
export const tranformApiCatsToAppCats = (apiCats: ApiCatImage[], favourites?: string[], votes?: { [imageId: string]: number }): AppCatImage[] => {
    return apiCats.map((apiCat) => ({
        imageId: apiCat.id,
        url: apiCat.url,
        imageWidth: apiCat.width,
        imageHeight: apiCat.height,
        // favouriteId: favourites?.favouriteId, // Correctly map favouriteId
        votes: votes?.[apiCat.id] || 0,
    }));
};
