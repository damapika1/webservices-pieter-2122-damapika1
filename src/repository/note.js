const {getKnex,tables}=require('../data');

SELECT_COLUMNS=[
  /*notes:*/`${tables.note}.id`,'title','text','date',
  /*users:*/`${tables.user}.id AS user_id`,`${tables.user}.name AS user_name`,
];

const findAll =({limit,offset})=>{
return getKnex()(tables.note)
.select()
.limit(limit)
.offset(offset)
.orderBy('title','ASC');
};

const findById = async(id) => {
  const notes = await getKnex()(`${tables.note}`)
  .join(`${tables.user}`,`${tables.user}.id`,'=',`${tables.note}.user_id`)
  .where(`${tables.note}.id`,id)
  .first(SELECT_COLUMNS);
  
return notes;
};




module.exports={
  findAll,
  findById, 
};