import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER, DATE }) => {
  class Comment extends Model {
    static associate({ User, Post }) {
      this.belongsTo(User, {
        as: 'user',
        foreignKey: 'userId',
      });

      this.belongsTo(Post, {
        as: 'post',
        foreignKey: 'postId',
      });
    }
  }

  Comment.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      comment: {
        type: STRING,
        allowNull: false,
      },
      userId: {
        allowNull: true,
        type: INTEGER,
      },
      postId: {
        allowNull: true,
        type: INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DATE,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
      timestamps: true,
    }
  );
  return Comment;
};
