import sequelize from 'sequelize';
import models from '../../models';

const { Op, fn, cast, col } = sequelize;
const { Post, Comment } = models;

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

export const listQuery = ({ status, searchString, name, title, pageNumber = 1, pageSize }) => {
  const query = { where: {} };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;
  query.attributes = { exclude: ['createdAt', 'updatedAt'] };
  if (status) {
    query.where[Op.and] = [{ status }];
  }
  // for filtering
  if (searchString) {
    const likeClause = { [Op.iLike]: `%${searchString}%` };
    query.where[Op.or] = [
      sequelize.where(fn('concat', col('firstName'), ' ', col('lastName')), likeClause),
      {
        email: likeClause,
      },
    ];
    const integerValue = parseInt(searchString, 10);
    if (integerValue > 0) {
      query.where[Op.or].push({
        id: integerValue,
      });
    }
  } else {
    if (name) {
      query.where[Op.and] = [
        sequelize.where(fn('concat', col('firstName'), ' ', col('lastName')), {
          [Op.iLike]: `%${name}%`,
        }),
      ];
    }
    if (title) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeLikeCondition('title', title));
    }
  }

  return query;
};

export const getUserByIdQuery = ({ id }) => {
  const query = {
    where: {
      id,
    },
  };
  query.attributes = {
    exclude: ['id', 'fullName', 'password', 'createdAt', 'updatedAt'],
  };
  query.include = [
    {
      model: Post,
      as: 'post',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Comment,
          as: 'comment',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    },
  ];
  return query;
};
