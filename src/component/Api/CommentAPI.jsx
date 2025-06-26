import axiosClient from './axiosClient'

const CommentAPI = {
    getComments: (query) => {
        const url = `/admin/comment${query}`  // Bỏ /api vì đã có trong baseURL
        return axiosClient.get(url)
    },

    getComment: (id) => {
        const url = `/admin/comment/${id}`  // Bỏ /api vì đã có trong baseURL
        return axiosClient.get(url)
    },

    deleteComment: (id) => {
        const url = `/admin/comment/${id}`  // Bỏ /api vì đã có trong baseURL
        return axiosClient.delete(url)
    },

    getUserInfo: (id) => {
        const url = `/admin/comment/user/${id}`  // Bỏ /api vì đã có trong baseURL
        return axiosClient.get(url)
    }
}

export default CommentAPI





