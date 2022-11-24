
function getBan(noCreators=true){
    if(!noCreators) return JSON.parse(localStorage.getItem("banned"))|| []
    let bandata =JSON.parse(localStorage.getItem("banned"))|| [] , banList =[];
    bandata.map(b=>{
       if (!parseInt(b)) {
        banList=[...banList , ... b.listNft]
       }else banList.push(b)
    })
    return  banList
 
 }
function getCreatorBan() {
    let  bandata =JSON.parse(localStorage.getItem("banned"))|| []
    bandata=bandata.filter(d=> !parseInt(d))
    return bandata.filter(d=> !parseInt(d))
}

  function setBan(banned){
     let bannedList = getBan(false)
     bannedList.push(banned)
     saveBan(bannedList)
  
 }
 function saveBan( bannedList){
     localStorage.setItem("banned", JSON.stringify(bannedList));
 }
 
 function deleteBan ( bannedId){
     let bannedList = getBan(false)
     bannedList = bannedList.filter ( id => id != bannedId)
     saveBan( bannedList)
 }
 function deleteBanCreator(username) {
    let bannedList = getBan(false)
    bannedList = bannedList.filter ( element =>{
        if(parseInt(element)) return true
        return element.username!=username
    } )
    saveBan( bannedList)
 }
 function isBanned(bannedId) {
    
     let bannedList = getBan()
     return bannedList.includes(bannedId)
     
 }
 
 export {isBanned, getBan , setBan , deleteBan,getCreatorBan,deleteBanCreator}