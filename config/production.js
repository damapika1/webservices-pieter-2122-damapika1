module.exports={
log:{
  level:"info",
  disabled:true,
},
cors: {
  origins: ['http://localhost:3000'],//* voor alles
  maxAge: 3 * 60 * 60,

}
};