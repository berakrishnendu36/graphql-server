const graphql = require('graphql');
const { GraphQLID, GraphQLString, GraphQLList, GraphQLInt, GraphQLInputObjectType } = graphql;


const NumericFilterInputType = new GraphQLInputObjectType({
    name: 'NumericFilter',
    fields: {
        eq: { type: GraphQLInt },
        lt: { type: GraphQLInt },
        gt: { type: GraphQLInt },
        lte: { type: GraphQLInt },
        gte: { type: GraphQLInt },
        ne: { type: GraphQLInt },
        in: { type: new GraphQLList(GraphQLInt) },
    },

});

const IDFilterType = new GraphQLInputObjectType({
    name: 'IDFilter',
    fields: {
        eq: { type: GraphQLID },
        ne: { type: GraphQLID },
        in: { type: new GraphQLList(GraphQLID) }
    }
});

const StringFilterInputType = new GraphQLInputObjectType({
    name: 'StringFilter',
    fields: {
        eq: { type: GraphQLString },
        lt: { type: GraphQLString },
        gt: { type: GraphQLString },
        lte: { type: GraphQLString },
        gte: { type: GraphQLString },
        ne: { type: GraphQLString },
        in: { type: new GraphQLList(GraphQLString) },
    }
})

function generateObject(ob) {
    if (ob == null) return {};
    let keys = Object.keys(ob);
    let obj = {};
    keys.forEach(key => {
        let fields = Object.keys(ob[key]);
        obj[key] = {};
        if (key == 'or') {
            obj['$or'] = ob[key].map(o => generateObject(o));
        }
        else {
            fields.forEach(field => {
                obj[key]['$' + field] = ob[key][field];
            })
        }
    })
    return obj;
}

module.exports = {
    NumericFilterInputType,
    StringFilterInputType,
    IDFilterType,
    generateObject,
}