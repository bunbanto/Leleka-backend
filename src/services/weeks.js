// import mongoose from 'mongoose';
// import { WeeksCollection } from '../db/models/week.js';

// async function fetchState(dbName, weekNumber) {
//   const conn = mongoose.connection.useDb(dbName);
//   return conn.db.collection('states').findOne({ weekNumber });
// }

// export async function getWeekPack(week) {
//   const num = Number(week);

//   const doc = await WeeksCollection.findOne({
//     $or: [{ week: num }, { weekNumber: num }],
//   }).lean();

//   let baby = doc?.baby ?? null;
//   let mom = doc?.mom ?? null;

//   const needsBaby = !baby;
//   const needsMom = !mom;

//   if (needsBaby || needsMom) {
//     const [babyDoc, momDoc] = await Promise.all([
//       needsBaby ? fetchState('baby', num) : Promise.resolve(null),
//       needsMom ? fetchState('mom', num) : Promise.resolve(null),
//     ]);

//     if (babyDoc) baby = babyDoc;
//     if (momDoc) mom = momDoc;
//   }

//   return {
//     week: num,
//     baby,
//     mom,
//   };
// }
import mongoose from 'mongoose';
import { WeeksCollection } from '../db/models/week.js';

async function fetchState(collectionName, weekNumber) {
  return mongoose.connection.db
    .collection(collectionName)
    .findOne({ weekNumber });
}

export async function getWeekPack(week) {
  const num = Number(week);

  // шукаємо в weeks
  const doc = await WeeksCollection.findOne({
    $or: [{ week: num }, { weekNumber: num }],
  }).lean();

  let baby = doc?.baby ?? null;
  let mom = doc?.mom ?? null;

  const needsBaby = !baby;
  const needsMom = !mom;

  if (needsBaby || needsMom) {
    const [babyDoc, momDoc] = await Promise.all([
      needsBaby ? fetchState('baby_states', num) : Promise.resolve(null),
      needsMom ? fetchState('mom_states', num) : Promise.resolve(null),
    ]);

    if (babyDoc) baby = babyDoc;
    if (momDoc) mom = momDoc;
  }

  return {
    week: num,
    baby,
    mom,
  };
}
