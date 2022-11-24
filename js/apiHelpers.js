import { getBan, isBanned } from "./ban.js";
import { isFav, getFavorite } from "./favorite.js";

let NFTS;

async function getAllNfts() {
    if (NFTS) {

        let listFav = getFavorite()
        let listBanned = getBan()

        NFTS.forEach(nft => {
            nft.favorite = false
            if (listFav.includes(nft.id)) nft.favorite = true
            nft.ban = false
            if (listBanned.includes(nft.id)) nft.ban = true
        })
        return NFTS
    }
    let data = []
    let currentPage = 1
    let notLast = true;
    while (notLast) {
        const url = "https://awesome-nft-app.herokuapp.com/?page=" + currentPage;
        await fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(async function (res) {
                if (res.next == currentPage) notLast = false

                res.assets.forEach((nft) => {
                    data.push({
                        id: nft.id,
                        title: nft.name,
                        creator: nft.creator,
                        img: nft.image_url,
                        created_at: nft.contract.created_at,
                        sales: nft.sales,
                        favorite: isFav(nft.id),
                        ban: isBanned(nft.id)

                    })
                });

            })
            .catch(function (error) {
                console.warn(error.message);
            });
        currentPage++;
    }


    NFTS = data
    return data
}

async function getNftById(id) {
    let nft;
    const url = "https://awesome-nft-app.herokuapp.com/nft/" + id;
    await fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(async function (res) {

            nft = {
                id: res.id,
                title: res.name,
                img: res.image_url,
                description: res.description,
                created_at: res.contract.created_at,
                sales: res.sales,
                favorite: isFav(res.id),
                creator: res.creator,
                collection: res.collection


            }


        })
        .catch(function (error) {
            nft = false
            console.warn(error.message);
        });

    return nft
}

async function getRandomNft(number = 3) {
    let nfts = await getAllNfts()
    return [...nfts].sort((a, b) => Math.random() - 0.5).slice(0, number);
}

async function getFavNft() {
    let nfts = await getAllNfts()
    return nfts.filter(nft => nft.favorite)
}
async function getBanNft() {
    let nfts = await getAllNfts()
    return nfts.filter(nft => nft.ban)
}

async function getNftBySearch(query) {
    let data = [];
    const url = " https://awesome-nft-app.herokuapp.com/search?q=" + query;
    await fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(async function (res) {


            res.assets.forEach((nft) => {
                data.push({
                    id: nft.id,
                    title: nft.name,
                    creator: nft.creator,
                    img: nft.image_url,
                    created_at: nft.contract.created_at,
                    sales: nft.sales,
                    favorite: isFav(nft.id),
                    ban: false

                })
            });

        })
        .catch(function (error) {
            console.warn(error.message);
        });
    return data
}



export { getAllNfts, getRandomNft, getBanNft, getFavNft, getNftById, getNftBySearch }