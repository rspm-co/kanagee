export const galleryPhotos=[
 {id:'maharashtrian-table',src:'/maharashtrian-thali.png',width:541,height:430,title:'The Maharashtrian table',mr:'एका ताटात अनेक चवी.',description:'Bhakri, rice and bowls of flavour, served together.',tags:['Thalis'],alt:'Maharashtrian thali with bhakri, rice and an assortment of dishes',cutout:false,region:null},
 {id:'seafood-platter',src:'/seafood-platter.png',width:1024,height:1536,title:'A seafood feast',mr:'समुद्राची चव, ताटात.',description:'Fish, prawns and crisp bites made for sharing.',tags:['Seafood'],alt:'Seafood platter with fried fish, prawns, vegetables and dipping sauces',cutout:false,region:null},
 {id:'traditional-thali',src:'/heritage-thali-cutout.png',width:1254,height:1254,title:'Tradition, by the spoonful',mr:'परंपरेचा प्रत्येक घास.',description:'Rice, roti, vegetables and a little something sweet.',tags:['Thalis'],alt:'Traditional steel thali with rice, roti, vegetables, curries and a sweet',cutout:true,region:null},
 {id:'fish-bhakri',src:'/experience-thali-cutout.png',width:1254,height:1254,title:'Bhakri. Curry. Comfort.',mr:'मन भरून येणारी चव.',description:'Fish, red curry and soft bhakri on a steel thali.',tags:['Thalis','Seafood'],alt:'Fish thali with bhakri, red curry, broth and onions',cutout:true,region:null},
];
// Assign a photo to exactly one of these regions when its origin is confirmed.
export const galleryRegions=['Konkan','Paschim Maharashtra','Uttar Maharashtra','Marathwada','Vidarbha'];
export const galleryFilters=['All',...galleryRegions];
