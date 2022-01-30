import React from 'react';
import './CommentBox';
import { createComment as CreateComment } from '../../graphql/mutations';
import { listComments as ListComments } from '../../graphql/queries';
import { onCreateComment as OnCreateComment } from '../../graphql/subscriptions';
import { Auth, API } from 'aws-amplify';

const initialState = {
    comments: []
};

function reducer(state, action) {
    switch(action.type) {
        case "SET_COMMENTS":
        return {
            ...state, comments: action.comments
        };
        case "ADD_COMMENT":
        return {
            ...state, comments: [...state.comments, action.comment ]
        };
        default:
        return state;
    };
};

export default function CommentBox() {  
    const [user, setUser] = React.useState(null);
    const [inputValue, setInput] = React.useState('');
    const [state, dispatch] = React.useReducer(reducer, initialState);
    
    React.useEffect(() => {
        Auth.currentAuthenticatedUser()
        .then(currentUser => setUser(currentUser))
        .catch(err => console.log({ err }))
        fetchComments()
        subscribe()
    }, [])

    function subscribe() {
        API.graphql({
        query: OnCreateComment
        })
        .subscribe({
        next: async commentData => {
            const { value: { data } } = commentData;
            try {
            const user = await Auth.currentAuthenticatedUser();
            if (user.username === data.onCreateComment.owner) {
                return
            }
            dispatch({ type: "ADD_COMMENT", comment: data.onCreateComment })
            } catch (err) { // fires if not logged in
            dispatch({ type: "ADD_COMMENT", comment: data.onCreateComment })
            }
        }
        })
    }
    async function fetchComments() {
        const commentData = await API.graphql({
        query: ListComments
        })
        dispatch({ type: "SET_COMMENTS", comments: commentData.data.listComments.items })
    }
    async function createComment() {
        if (!inputValue) return
        const message = inputValue;
        setInput('');
        dispatch({
        type: "ADD_COMMENT", comment: { message, owner: user.username }
        })
        await API.graphql({
        query: CreateComment,
        variables: {
            input: { message }
        },
        authMode: "AMAZON_COGNITO_USER_POOLS"
        })

    }
    async function onChange(e) {
        e.persist();
        setInput(e.target.value);
    }

    return (
        <div style={{ width: 300, border: '1px solid tan'}}>
            {
            user && (
                <div>
                <input value={inputValue} onChange={onChange} placeholder="comment" />
                <button
                    onClick={createComment}
                >Create Comment</button>
                </div>
            )
            }
            {
            state.comments.map((comment, index) => (
                <div key={index}>
                <p>{comment.message}</p>
                <span>From: {comment.owner}</span>
                </div>
            ))
            }
        </div>
    )
}
