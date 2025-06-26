import axiosClient from "./axiosClient"

const categoryAPI = {

    getAPI: () => {
        const url = '/category'
        return axiosClient.get(url)
    },
    getAPIPage: (query) => {
        const url = `/admin/Category${query}`
        return axiosClient.get(url)
    },
    details: (id) => {
        const url = `/admin/Category/${id}`
        return axiosClient.get(url)
    },
    detailProduct: (id, query) => {
        const url = `/admin/Category/detail/${id}${query}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `/admin/Category/create`;
        return axiosClient.post(url, data);
    },
    update: (query) => {
        const url = `/admin/Category/update${query}`
        return axiosClient.put(url)
    },
    delete: (query) => {
        const url = `/admin/Category/delete${query}`
        return axiosClient.delete(url)
    }

}

export default categoryAPI