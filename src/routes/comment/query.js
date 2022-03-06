import sequelize from 'sequelize';
import models from '../../models';

const { Op, fn, cast, col } = sequelize;
const { User, Comment } = models;

const makeLikeCondition = (columnName, searchValue) => {
  const condition = {};
  condition[columnName] = { [Op.iLike]: `%${searchValue}%` };
  return condition;
};
const makeEqualityCondition = (columnName, searchValue) => {
  const condition = {};
  condition[columnName] = { [Op.eq]: `${searchValue}` };
  return condition;
};

export const listQuery = ({ title, pageNumber = 1, pageSize }) => {
  const query = { where: {} };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;
  query.attributes = { exclude: ['createdAt', 'updatedAt'] };

  if (title) {
    query.where[Op.and] = query.where[Op.and] || [];
    query.where[Op.and].push(makeLikeCondition('title', title));
  }

  return query;
};

// export const getPostByIdQuery = ({ id }) => {
//   const query = {
//     where: {
//       id,
//     },
//   };
//   query.attributes = {
//     exclude: ['createdAt', 'updatedAt'],
//   };
//   query.include = [
//     {
//       model: User,
//       as: 'user',
//       attributes: {
//         exclude: ['createdAt', 'updatedAt', 'password'],
//       },
//     },
//     {
//       model: Comment,
//       as: 'comment',
//       attributes: {
//         exclude: ['createdAt', 'updatedAt'],
//       },
//       include: [
//         {
//           model: User,
//           as: 'user',
//           attributes: {
//             exclude: [
//               'createdAt',
//               'updatedAt',
//               'password',
//               'active',
//               'avatar',
//               'isActive',
//               'postId',
//             ],
//           },
//         },
//       ],
//     },
//   ];
//   return query;
// };
