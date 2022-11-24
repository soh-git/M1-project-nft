
function getFavorite(){
   return  JSON.parse(localStorage.getItem("fav"))|| [] 

}
 function setFavorite(favId){
    let favList = getFavorite()
    favList.push(favId)
    saveFavorite(favList)
 
}
function saveFavorite( favList){
    localStorage.setItem("fav", JSON.stringify(favList));
}

function deleteFavorite ( favId){
    let favList = getFavorite()
    favList = favList.filter ( id => id != favId)
    saveFavorite( favList)
}
function isFav(favId) {
   
    let favList = getFavorite()
    return favList.includes(favId)
    
}

export {isFav, getFavorite , setFavorite , deleteFavorite}