const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLSchema} = graphql;
// const {getAllBooks, getAllAuthors} = require('../parser/functions')
const { projects, clients } = require('./sampleData')

import {clientsType, projectsType} from '../types/types'

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: {'type': GraphQLString},
        clientId: {'type': GraphQLString},
        name: {'type': GraphQLString},
        description: {'type': GraphQLString},
        status: {'type': GraphQLString},
        clientDetails: {
            type: ClientType,
            resolve (parent: any, args: {id: string}) {
                return clients.find((client: clientsType) => client.id === parent.clientId)
            }
        }
    })
})

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: {'type': GraphQLString},
        name : {'type': GraphQLString},
        phone: {'type': GraphQLString},
        email: {'type': GraphQLString}
    })
})



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        allProjects : {
            type: new GraphQLList(ProjectType),
            resolve (parent: any, args: {id: string}) {
                return projects
            }
        },

        getProject : {
            type: ProjectType,
            args: {id: {'type': GraphQLString}},
            resolve (parent: any, args: {id: string}) {
                return projects.find((project: projectsType) => project.id === args.id)
            }
        },

        allClients : {
            type: new GraphQLList(ClientType),
            resolve (parent: any, args: {id: string}) {
                return clients
            }
        },

        getClient : {
            type: ClientType,
            args: {id: {'type': GraphQLString}},
            resolve (parent: any, args: {id: string}) {
                return clients.find((client: clientsType) => client.id === args.id)
            }
        },
    }
})

export {};
module.exports = new GraphQLSchema({
    query: RootQuery
})