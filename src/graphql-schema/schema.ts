const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLSchema} = graphql;
// const {getAllBooks, getAllAuthors} = require('../parser/functions')
const { projects, clients } = require('./sampleData') // the fake database

import {clientsType, projectsType} from '../types/types' //  types declarative for typescripts
const ClientModel = require('../models/Client')
const ProjectModel = require('../models/Project')

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
                return ClientModel.findById(parent.clientId)
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
        email: {'type': GraphQLString},
        allProjects: {
            'type': new GraphQLList(ProjectType),
            resolve (parent: any, args: {id: string}) {
                console.log({clientId: parent.id})
                return ProjectModel.find({clientId: parent.id})
            }
        }
    })
})



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        allProjects : {
            type: new GraphQLList(ProjectType),
            resolve (parent: any, args: {id: string}) {
                return ProjectModel.find()
            }
        },

        getProject : {
            type: ProjectType,
            args: {id: {'type': GraphQLString}},
            resolve (parent: any, args: {id: string}) {
                return ProjectModel.findById(args.id)
            }
        },

        allClients : {
            type: new GraphQLList(ClientType),
            resolve (parent: any, args: {id: string}) {
                return ClientModel.find()
            }
        },

        getClient : {
            type: ClientType,
            args: {id: {'type': GraphQLString}},
            resolve (parent: any, args: {id: string}) {
                return ClientModel.findById(args.id)
            }
        },
    }
})

export {};
module.exports = new GraphQLSchema({
    query: RootQuery
})