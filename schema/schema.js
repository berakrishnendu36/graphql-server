
const graphql = require('graphql');

const User = require('../models/user');

const { NumericFilterInputType, StringFilterInputType, IDFilterType, generateObject } = require('../utils/filters')

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLInputObjectType } = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        _id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
})

const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
    }
});

const UserInputFilterObject = new GraphQLInputObjectType({
    name: 'UserInputFilterObject',
    fields: {
        _id: {
            type: IDFilterType
        },
        firstName: {
            type: StringFilterInputType
        },
        lastName: {
            type: StringFilterInputType
        },
        age: {
            type: NumericFilterInputType,
        },
        email: {
            type: StringFilterInputType,
        }
    }
});

const UserInputFilterType = new GraphQLInputObjectType({
    name: 'UserInputFilter',
    fields: {
        _id: {
            type: IDFilterType
        },
        or: {
            type: new GraphQLList(UserInputFilterObject)
        },
        firstName: {
            type: StringFilterInputType
        },
        lastName: {
            type: StringFilterInputType
        },
        age: {
            type: NumericFilterInputType,
        },
        email: {
            type: StringFilterInputType,
        }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        status: {
            type: GraphQLString,
            resolve: () => 'GraphQL is running'
        },
        user: {
            type: UserType,
            args: {
                _id: { type: GraphQLID }
            },
            resolve(root, args) {
                return User.findById(args._id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            args: {
                first: { type: GraphQLInt },
                skip: { type: GraphQLInt },
                where: { type: UserInputFilterType },
            },
            resolve(root, args) {
                const obj = generateObject(args.where);
                return User.find({
                    ...obj
                }, {}, {
                    limit: args.first,
                    skip: args.skip
                })
            }
        }

    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                fields: {
                    type: UserInputType
                }
            },
            resolve(root, args) {
                let user = new User({
                    ...args.fields
                });
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                _id: { type: GraphQLID },
                fields: {
                    type: UserInputType
                }
            },
            resolve(root, args) {
                return User.findByIdAndUpdate(args._id, args.fields);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})