import { gql } from '@apollo/client';

// the query below fetches all the projects
const GET_PROJECTS = gql`
    query getProjects {
        allProjects {
            id
            name
            status
        }
    }
`;

// the query below fetches just one project
const GET_PROJECT = gql`
    query getProject($id: ID!) {
        getProject(id: $id) {
            id
            name
            description
            status
            client {
                id
                name
                email
                phone
            }
        }
    }
`;

export { GET_PROJECTS, GET_PROJECT };