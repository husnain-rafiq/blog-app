import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER, ENUM, BOOLEAN, DATE }) => {
  class User extends Model {
    static associate({ Post }) {
      this.hasMany(Post, {
        as: 'post',
        foreignKey: 'userId',
      });
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      username: {
        type: STRING,
        allowNull: false,
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: STRING,
        allowNull: false,
      },
      role: {
        type: ENUM('super', 'admin', 'user'),
        defaultValue: 'user',
      },
      isActive: {
        type: BOOLEAN,
      },
      avatar: {
        type: STRING,
        allowNull: true,
      },
      postId: {
        type: INTEGER,
        allowNull: true,
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
      modelName: 'User',
      timestamps: true,
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  );
  return User;
};
