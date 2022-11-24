import { deleteBan, setBan, deleteBanCreator } from "./ban.js";
import { deleteFavorite, isFav, setFavorite } from "./favorite.js";

function createNftCard(nft) {
    let card = document.createElement("div")
    card.classList.add("card")
    card.id = "nft" + nft.id

    let cardImg = document.createElement("div")
    cardImg.classList.add('card-img')
    let nftImg = new Image();
    nftImg.src = nft.img || "img/logo.png";
    cardImg.appendChild(nftImg)
    let title = document.createElement("div")
    title.classList.add("card-title")
    title.innerHTML = `<h3>${nft.title ? nft.title : "titre inconnu"} </h3>`
    card.appendChild(cardImg)
    card.appendChild(title)

    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    let date = new Date(nft.created_at)
    let cardDescription = document.createElement('div')
    cardDescription.classList.add('card-description')
    cardDescription.innerHTML = `
                    <p> crée par ${nft.creator.username == "" ? "artiste inconnu" : nft.creator.username} </p>
                    <p> le ${date.toLocaleDateString()}  </p>
                    <p> ${nft.sales}  ventes</p>
`;
    let cardAction = document.createElement('div')
    cardAction.classList.add('card-action')
    let iconFav = document.createElement('i')
    iconFav.classList.add('fa-solid', 'fa-star', "iconfav")
    if (nft.favorite) {
        iconFav.classList.add('fav')

    }
    iconFav.id = "fav" + nft.id
    iconFav.addEventListener("click", (event) => {
        document.getElementById("fav" + nft.id).classList.toggle('fav');
        if (isFav(nft.id)) {
            deleteFavorite(nft.id)
            return
        }
        setFavorite(nft.id)
    })
    let iconBan = document.createElement('i')

    iconBan.id = "ban" + nft.id

    iconBan.addEventListener("click", (event) => {
        let decision = confirm("Êtes-vous sûr de vouloir bloquer le nft?")
        if (decision) {
            setBan(nft.id)
            document.getElementById("nft" + nft.id).remove()


        }
    })
    iconBan.classList.add('fa-solid', 'fa-ban', 'iconBan')
    if (!nft.ban) {
        cardAction.appendChild(iconFav)
        cardAction.appendChild(iconBan)
    }

    let cardBtn = document.createElement("a")

    if (!nft.ban) {
        cardBtn.innerText = "découvrir"
        cardBtn.classList.add("btn")
        cardBtn.addEventListener('click', () => {
            window.location.href = "#/product/" + nft.id
        })
    } else {
        cardBtn.innerText = "récuperer"
        cardBtn.classList.add("btn")
        cardBtn.addEventListener('click', () => {
            let decision = confirm("Êtes-vous sûr de vouloir restaurer le nft?")
            if (decision) {
                deleteBan(nft.id)
                document.getElementById("nft" + nft.id).remove()


            }
        })
    }
    cardBody.appendChild(cardDescription)
    cardBody.appendChild(cardAction)
    cardBody.appendChild(cardBtn)

    card.appendChild(cardBody)


    return card
}

function createNftArcticle(nft) {
    let article = document.createElement('article')
    let articleTitle = document.createElement('div')
    articleTitle.classList.add('article-title')
    articleTitle.innerHTML = `<h2> ${nft.title ? nft.title : "titre inconnu"}</h2>`
    let articleImg = document.createElement('div')
    articleImg.classList.add("article-img")

    let img = new Image()
    img.src = nft.img || "img/logo.png";
    articleImg.appendChild(img)
    let articleOwner = document.createElement('div');
    articleOwner.classList.add("article-owner")

    let profilPic = document.createElement('div');
    profilPic.classList.add('profilPic')
    let imageProfil = new Image();
    imageProfil.src = nft.creator.profile_url || "img/logo.png"; 
    profilPic.appendChild(imageProfil)
    let ownerDisc = document.createElement('div')
    let date = new Date(nft.created_at)
    ownerDisc.classList.add('owner-disc')
    ownerDisc.innerHTML = `  <h3>  ${nft.creator.username ? nft.creator.username : "artiste inconnu"}</h3>
     <p> le ${date.toLocaleDateString()}</p>`
    articleOwner.appendChild(profilPic)
    articleOwner.appendChild(ownerDisc)

    let articleSale = document.createElement('div');
    articleSale.classList.add('article-sale')
    articleSale.innerHTML = `${nft.sales} ventes`

    let articleDisc = document.createElement('div');
    articleDisc.classList.add('article-disc')
    articleDisc.innerHTML = ` <p>${nft.description ? nft.description : "Pas de description."}</p>`







    article.appendChild(articleTitle)
    article.appendChild(articleImg)
    article.appendChild(articleOwner)
    article.appendChild(articleSale)
    article.appendChild(articleDisc)
    if (nft.collection) {
        let articleColl = document.createElement('div')
        articleColl.classList.add('article-collection')
        articleColl.innerHTML = `<h3> Collection : ${nft.collection.name} </h3>
    <img src="https://lh3.googleusercontent.com/36GIeJWF7yspIi5SsN0CtMfYVF4X_WqH9LhSHBlKOPlrY0xz2uwp0Jdd4dS6_RB7AHD_xFleYnjPB6woLG_vuQCSfKNkgKBXHjvr=s2500"
        alt="">
        <p>${nft.collection.description ? nft.collection.description : "Pas de description."} </p>
        `

        article.appendChild(articleColl)
    }

    return article

}


function createCreatorCard(creator) {
    let card = document.createElement('div')
    card.id = "card" + creator.username

    let creatorDiv = document.createElement('div')
    creatorDiv.classList.add('creator')



    let profilPic = document.createElement('div');
    profilPic.classList.add('profilPicCreator')
    let imageProfil = new Image();
    imageProfil.src = creator.pp || "img/logo.png";
    profilPic.appendChild(imageProfil)
    let creatorDisc = document.createElement('div');
    creatorDisc.classList.add('creator-discription')
    let username = creator.username.length > 16 ? creator.username.slice(0, 16) + '...' : creator.username
    creatorDisc.innerHTML = `
<h3> ${username}</h3>
<p> ${creator.listNft.length} nft${creator.listNft.length > 1 ? "s" : ''}</p>
<a class="detailC" href="#/creators/${creator.username}"> voir les nfts  </a>
    `
    let cardBtnCreator = document.createElement('a');
    if (!creator.ban) {
        cardBtnCreator.innerText = "bloquer cet artiste"
        cardBtnCreator.classList.add("btnCreator")
        cardBtnCreator.addEventListener('click', () => {
            let decision = confirm("Êtes-vous sûr de vouloir bloquer " + creator.username + "?")
            if (decision) {
                creator.ban = true
                setBan(creator)
                document.getElementById("card" + creator.username).remove()


            }
        })
    } else {
        cardBtnCreator.innerText = "récuperer"
        cardBtnCreator.classList.add("btnCreator")
        cardBtnCreator.addEventListener('click', () => {
            let decision = confirm("Êtes-vous sûr de vouloir débloquer " + creator.username + "?")
            if (decision) {
                deleteBanCreator(creator.username)
                document.getElementById("card" + creator.username).remove()


            }
        })
    }





    creatorDiv.appendChild(profilPic)
    creatorDiv.appendChild(creatorDisc)
    card.appendChild(creatorDiv)
    card.appendChild(cardBtnCreator)

    return card
}
function createNftCardLoader() {
    let card = document.createElement("div")
    card.classList.add("card", 'content-loader')


    let cardImg = document.createElement("div")
    cardImg.classList.add('card-img')
    let nftImg = new Image();
    nftImg.src = "img/logo.png";
    cardImg.appendChild(nftImg)
    let title = document.createElement("div")
    title.classList.add("card-title")
    title.innerHTML = `<h3> "-------------------" </h3>`
    card.appendChild(cardImg)
    card.appendChild(title)

    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')


    let cardDescription = document.createElement('div')
    cardDescription.classList.add('card-description')
    cardDescription.innerHTML = `
                    <p> ------------------------------------</p>
                    <p> ---------------------------------  </p>
                    <p>-----------------------</p>
`;
    let cardAction = document.createElement('div')
    cardAction.classList.add('card-action')
    let iconFav = document.createElement('i')
    iconFav.classList.add('fa-solid', 'fa-star', "iconfav")


    let iconBan = document.createElement('i')


    iconBan.classList.add('fa-solid', 'fa-ban', 'iconBan')
    cardAction.appendChild(iconFav)
    cardAction.appendChild(iconBan)
    let cardBtn = document.createElement("a")


    cardBtn.innerText = "---------------------------------"
    cardBtn.classList.add("btn")


    cardBody.appendChild(cardDescription)
    cardBody.appendChild(cardAction)
    cardBody.appendChild(cardBtn)

    card.appendChild(cardBody)


    return card
}
export { createNftCard, createNftArcticle, createCreatorCard, createNftCardLoader }