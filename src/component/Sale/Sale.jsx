import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

import permissionAPI from '../Api/permissionAPI';
import Pagination from '../Shared/Pagination'
import Search from '../Shared/Search'
import SaleAPI from '../Api/SaleAPI';

function Sale(props) {
    const [filter, setFilter] = useState({
        page: '1',
        limit: '4',
        search: '',
        status: true
    })

    const [sale, setSale] = useState([])
    const [totalPage, setTotalPage] = useState()

    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const ct = await SaleAPI.getAll(query)
            setTotalPage(ct.totalPage)
            setSale(ct.sale)
        }

        fetchAllData()
    }, [filter])

    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }

    const handlerSearch = (value) => {
        setFilter({
            ...filter,
            page: '1',
            search: value
        })
    }

    // Thêm hàm xử lý Delete Sale
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn Delete khuyến mãi này?')) {
            try {
                const response = await SaleAPI.deleteSale(id);
                if (response.msg === "Thanh Cong") {
                    // Refresh danh sách sau khi Delete
                    setFilter({
                        ...filter,
                        status: !filter.status
                    });
                    alert('Delete khuyến mãi thành công!');
                } else {
                    alert('Delete khuyến mãi thất bại!');
                }
            } catch (error) {
                console.error('Error deleting sale:', error);
                alert('Đã xảy ra lỗi khi Delete khuyến mãi!');
            }
        }
    }

    return (
        <div className="page-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Sale</h4>
                                <Search handlerSearch={handlerSearch} />

                                <Link to="/sale/create" className="btn btn-primary my-3">New create</Link>


                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Promotion</th>
                                                <th>Describe</th>
                                                <th>Product</th>
                                                <th>Product Price</th>
                                                <th>Start</th>
                                                <th>End</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                sale && sale.map((value, index) => (
                                                    <tr key={index}>
                                                        <td className="name">{value._id}</td>
                                                        <td className="name">{value.promotion}</td>
                                                        <td className="name">{value.describe}</td>
                                                        <td className="name">{value.id_product?.name_product || 'N/A'}</td>
                                                        <td className="name">
                                                            {value.id_product?.price_product 
                                                                ? new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(value.id_product.price_product) + ' VNĐ'
                                                                : 'N/A'
                                                            }
                                                        </td>
                                                        <td className="name">{value.start}</td>
                                                        <td className="name">{value.end}</td>
                                                        <td className="name">{value.status ? "Active" : "Disable"}</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={"/sale/" + value._id} className="btn btn-success mr-1">Update</Link>
                                                                <button 
                                                                    type="button" 
                                                                    className="btn btn-danger"
                                                                    onClick={() => handleDelete(value._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
    );
}

export default Sale;
