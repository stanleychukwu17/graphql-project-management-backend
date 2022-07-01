const graphql = require('graphql');
const ClientModel = require('../models/Client')
const ProjectModel = require('../models/Project')
import {clientsType, projectsType} from '../types/types' // types declarative for typescripts

const {
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull,
    GraphQLList, GraphQLEnumType, GraphQLSchema
} = graphql;




// Belows are the types - first is the project type
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

// the clientType
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


// the RootQueries
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



// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add a client
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) }
            },
                resolve(parent:{}, args:{name:string, email:string, phone:string}) {
                const client = new ClientModel({name: args.name, email: args.email, phone: args.phone});
                return client.save();
            },
        },

        // Delete a client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent: {}, args: {id: string}) {
                ProjectModel.find({ clientId: args.id }).then((projects:[]) => {
                    projects.forEach((project: any) => {
                    project.remove();
                    });
                });
        
                return ClientModel.findByIdAndRemove(args.id);
            },
        },

        // Add a project
        addProject: {
            type: ProjectType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            new: { value: 'Not Started' },
                            progress: { value: 'In Progress' },
                            completed: { value: 'Completed' },
                        },
                    }),
                    defaultValue: 'Not Started',
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent: any, args: {name:string, description:string, status: string, clientId: string}) {
                const project = new ProjectModel({name: args.name, description: args.description, status: args.status, clientId: args.clientId});
                return project.save();
            },
        },

        // Delete a project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent: [], args: {id: string}) {
                return ProjectModel.findByIdAndRemove(args.id);
            },
        },

    // Update a project
    updateProject: {
        type: ProjectType,
        args: {
            id: { type: GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            description: { type: GraphQLString },
            status: {
                type: new GraphQLEnumType({
                name: 'ProjectStatusUpdate',
                values: {
                    new: { value: 'Not Started' },
                    progress: { value: 'In Progress' },
                    completed: { value: 'Completed' },
                },
                }),
            },
        },
        resolve(parent: any, args: {id: string, name:string, description: string, status: string}) {
          return ProjectModel.findByIdAndUpdate(
            args.id,
            {
              $set: {
                'name': args.name,
                'description': args.description,
                'status': args.status,
              },
            },
            { new: true }
          );
        },
    },



    }
})


export {};
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})