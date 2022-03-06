import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER, DATE }) => {
  class Post extends Model {
    static associate({ User, Comment }) {
      this.belongsTo(User, {
        as: 'user',
        foreignKey: 'userId',
      });
      this.hasMany(Comment, {
        as: 'comment',
        foreignKey: 'postId',
      });
    }
  }

  Post.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      title: {
        type: STRING,
        allowNull: false,
      },
      description: {
        type: STRING,
        allowNull: false,
      },
      userId: {
        allowNull: true,
        type: INTEGER,
      },
      commentId: {
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
      modelName: 'Post',
      timestamps: true,
    }
  );
  return Post;
};
