import axiosClient from "./axiosClient";
import axios from "axios"; // Thêm dòng này để dùng riêng axios cho endpoint khác domain

const productAPI = {
    getAPI: (query) => {
        const url = `/admin/product${query}`;
        return axiosClient.get(url);
    },

    details: (id) => {
        const url = `/admin/product/${id}`;
        return axiosClient.get(url);
    },

    // Sử dụng domain riêng cho create
    create: (formData) => {
        const url = `https://search-by-ai.onrender.com/product/create`;
        return axios.post(url, formData);
    },

    update: (data) => {
        const url = `/admin/product/update`;
        return axiosClient.patch(url, data);
    },

    delete: (query) => {
        const url = `/admin/product/delete${query}`;
        return axiosClient.delete(url);
    },

    getAll: () => {
        const url = `/product`;
        return axiosClient.get(url);
    },
};

export default productAPI;
