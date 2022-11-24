import { getAllNfts, getFavNft, getRandomNft, getNftById, getNftBySearch ,getBanNft } from "./apiHelpers.js"
import { getBan ,getCreatorBan} from "./ban.js"
import { createCreatorCard, createNftArcticle, createNftCard, createNftCardLoader } from "./cards.js"

const fragments = document.getElementsByClassName('fragment')
const HOME = document.getElementById('home')
const EXPLORE = document.getElementById('explore')
const FAVORITE = document.getElementById('favorite')
const PRODUCT = document.getElementById('product')
const CREATOR = document.getElementById('creator')
const NOTFOUND = document.getElementById('notFound')
const BANNED = document.getElementById('banned')

const cardsFav = document.getElementById("cardsNftFav")
const cardsNFTS = document.getElementById("cardsNft")
const cardsExplo = document.getElementById("cardsExplo")
const articleNft = document.getElementById('articleNft')
const cardsCreator = document.getElementById('cardsCreator')
const cardsNftBanned = document.getElementById('cardsNftBanned')
const creatorNftBanned =  document.getElementById('creatorNftBanned')

const SortSale = document.getElementById('SortSale')
SortSale.addEventListener('click', () => {
    document.getElementById('querySearch').value = ""
    explore("sale")
})

const btnSearch = document.getElementById("btnSearch")

btnSearch.addEventListener('click', () => {
    if (document.getElementById('querySearch').value) explore("search")

})

const btnResetSort = document.getElementById('btnResetSort')
btnResetSort.addEventListener('click', () => {
    document.getElementById('querySearch').value = ""
    explore()
})

let routes = {
    "/": () => home(),
    "/explore": () => explore(),
    "/favorite": () => favorite(),
    "/product/": () => product(),
    "/creators/": () => creator(),
    "/banned": () => banned(),




}

async function home() {
    HOME.style.display = 'block'


    resetCards()
    let nftsExplo = await getRandomNft()
    nftsExplo=nftsExplo.filter(nft=> !nft.ban)

    nftsExplo.forEach(nft => {
        cardsExplo.appendChild(createNftCard(nft))
    })

  


}
async function explore(sortby = null) {
    EXPLORE.style.display = 'block'
    
    resetCards()
    // contentloader
    for (let i = 0; i < 4; i++) cardsNFTS.appendChild(createNftCardLoader())
    
    let nfts;
    if (sortby == "search") {
        nfts = await getNftBySearch(document.getElementById('querySearch').value)

    } else nfts = await getAllNfts()
    
    if (sortby == "sale") nfts = [...nfts].sort((a, b) => b.sales - a.sales)
    nfts=nfts.filter(nft=> !nft.ban)
    resetCards() // delete contentloader
   
    nfts.forEach(nft => {
        let card = createNftCard(nft)
        cardsNFTS.appendChild(card)

    })


}
async function favorite() {
    FAVORITE.style.display = 'block'

    resetCards()


    let nftsFav = await getFavNft()
    nftsFav=nftsFav.filter(nft=> !nft.ban)

    if (nftsFav.length < 1) {
        cardsFav.innerHTML = " <p> vous n'avait rien aimé pour le moment </p>"
    } else {
        nftsFav.forEach(nft => {
            cardsFav.appendChild(createNftCard(nft))
        })
    }



}
async function banned() {
    BANNED.style.display = 'block'

    resetCards()


    let BannedList = await getBanNft();
    let bannedCreators =getCreatorBan();
    bannedCreators.forEach(creator => {
        
        BannedList= BannedList.filter(nft=> !creator.listNft.includes(nft.id))
        let card = createCreatorCard(creator)
        creatorNftBanned.appendChild(card)

    })

    if (BannedList.length < 1) {
        cardsNftBanned.innerHTML = " <p> vous n'avez pas bloqué de nft </p>"
    } else {
        BannedList.forEach(nft => {
            cardsNftBanned.appendChild(createNftCard(nft))
        })
    }



}
async function product() {
    let currentPage = window.location.hash.slice(1)
    let listBanned = getBan()
    let id = currentPage.split('/product/')[1]
    if (!parseInt(id) || listBanned.includes(parseInt(id))) { notFound(); return }
    let nft = await getNftById(id)
    if (!nft) { notFound(); return }
    PRODUCT.style.display = 'block'
    resetCards()
    articleNft.append(createNftArcticle(nft))

}
async function creator() {
    let nfts = await getAllNfts()
    nfts=nfts.filter(nft=> !nft.ban)
    resetCards()
    let creators = {};
    nfts.forEach(nft => {
        let creator = nft.creator
        let username = creator.username || "unknown"
        if (!(username in creators)) {
            creators[username] = {
                username: username,
                listNft: [nft.id],
                pp: creator.profile_url,
                ban :false
            }
        }else {
            creators[username].listNft.push(nft.id)
        }
    })
    let currentPage = window.location.hash.slice(1)
    let creator = currentPage.split('/creators/')[1]
    if (!creator) {
        CREATOR.style.display = 'block'

        Object.values(creators).sort((a,b)=> a.username.localeCompare(b.username)).forEach(creator => {
            let card = createCreatorCard(creator)
            cardsCreator.appendChild(card)

        })
    } else {
        [creator] = Object.values(creators).filter(c => c.username == creator)
        if (!creator) {
            notFound()
            return
        }
        CREATOR.style.display = 'block'

        nfts = nfts.filter(nft => creator.listNft.includes(nft.id))
        nfts.forEach(nft => {
            let card = createNftCard(nft)
            cardsCreator.appendChild(card)

        })
    }

    return

}

function notFound() {
    NOTFOUND.style.display = "block"
    
}
function router(e) {
    for (let i = 0; i < fragments.length; i++) {
        fragments[i].style.display = 'none'

    }
    let currentPage = window.location.hash.slice(1) || '/'
    if (currentPage in routes) {
        let page = routes[currentPage]
        page()
        return
    }
    if (currentPage.indexOf("/product/") === 0) {
        let page = routes["/product/"]
        page()
        return
    }
    if (currentPage.indexOf("/creators/") === 0) {
        let page = routes["/creators/"]
        page()
        return
    }

    notFound()

}

function resetCards() {
    const components = [articleNft, cardsNFTS, cardsFav, cardsExplo, cardsCreator,cardsNftBanned,creatorNftBanned]
    components.forEach(c => {
        while (c.firstChild) {
            c.removeChild(c.lastChild);
        }
    })



}
export { router }