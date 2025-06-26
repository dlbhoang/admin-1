import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderAPI from '../Api/orderAPI';
import productAPI from '../Api/productAPI';
import userAPI from '../Api/userAPI';
import { FaUsers, FaShoppingCart, FaBoxOpen, FaMoneyBillWave, FaTag, FaPercent, FaListAlt, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchOrders(),
                fetchProducts(),
                fetchCustomerCount()
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getAPI('?limit=1000');
            const orders = response.orders || [];
            
            const completedOrders = orders.filter(order => order.status === '4');
            const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
            
            // Lấy 5 đơn hàng gần nhất
            const recentOrders = orders
                .sort((a, b) => {
                    // Kiểm tra các trường thời gian có thể có
                    const dateA = a.createdAt || a.create_time;
                    const dateB = b.createdAt || b.create_time;
                    
                    if (!dateA) return 1;
                    if (!dateB) return -1;
                    
                    // Nếu là định dạng DD/MM/YYYY
                    if (typeof dateA === 'string' && dateA.includes('/')) {
                        const [dayA, monthA, yearA] = dateA.split('/').map(Number);
                        const [dayB, monthB, yearB] = dateB.split('/').map(Number);
                        return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
                    }
                    
                    return new Date(dateB) - new Date(dateA);
                })
                .slice(0, 5);
            
            // Lấy thêm thông tin chi tiết đơn hàng
            for (const order of recentOrders) {
                try {
                    if (order._id) {
                        // Sử dụng API detailOrder để lấy chi tiết Product trong đơn hàng
                        const detailResponse = await orderAPI.detailOrder(order._id, '');
                        console.log(`Order detail for ${order._id}:`, detailResponse);
                        
                        if (detailResponse && detailResponse.details) {
                            order.products = detailResponse.details;
                        } else if (detailResponse && detailResponse.orderDetail) {
                            order.products = detailResponse.orderDetail;
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching order details for ${order._id}:`, error);
                }
            }
            
            console.log("Recent orders with products:", recentOrders);
            
            setStats(prevStats => ({
                ...prevStats,
                totalOrders: orders.length,
                totalRevenue: totalRevenue,
                recentOrders: recentOrders
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    
    const fetchProducts = async () => {
        try {
            const response = await productAPI.getAPI('?limit=1000');
            const products = response.products || [];
            
            setStats(prevStats => ({
                ...prevStats,
                totalProducts: products.length
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    
    const fetchCustomerCount = async () => {
        try {
            const customerFilter = {
                permission: '6087dcb5f269113b3460fce4',
                limit: '1'
            };
            
            const query = '?' + new URLSearchParams(customerFilter).toString();
            const response = await userAPI.getAPI(query);
            
            if (response && response.totalPage) {
                const totalUsers = response.totalPage * parseInt(customerFilter.limit || 1);
                
                setStats(prevStats => ({
                    ...prevStats,
                    totalUsers: totalUsers
                }));
            }
        } catch (error) {
            console.error('Error fetching customer count:', error);
        }
    };

    // Định dạng tiền tệ VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-12">
                        <h4 className="text-themecolor">Dashboard</h4>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)">Home</a></li>
                            <li className="breadcrumb-item active">Dashboard</li>
                        </ol>
                    </div>
                </div>
                
                {loading ? (
                    <div className="d-flex justify-content-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Thống kê tổng quan */}
                        <div className="row">
                            <div className="col-lg-3 col-md-6">
                                <div className="card border-left-primary shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                    Tổng đơn hàng</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalOrders}</div>
                                            </div>
                                            <div className="col-auto">
                                                <FaShoppingCart className="fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-3 col-md-6">
                                <div className="card border-left-success shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                    Doanh thu</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                    {formatCurrency(stats.totalRevenue)}
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <FaMoneyBillWave className="fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-3 col-md-6">
                                <div className="card border-left-info shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                    Product</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalProducts}</div>
                                            </div>
                                            <div className="col-auto">
                                                <FaBoxOpen className="fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-3 col-md-6">
                                <div className="card border-left-warning shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                    Khách hàng</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalUsers}</div>
                                            </div>
                                            <div className="col-auto">
                                                <FaUsers className="fa-2x text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Các nút điều hướng */}
                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3">
                                        <h6 className="m-0 font-weight-bold text-primary">Quản lý hệ thống</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3 mb-4">
                                                <Link to="/product" className="btn btn-primary btn-block py-3">
                                                    <FaBoxOpen className="mr-2" /> Product
                                                </Link>
                                            </div>
                                            <div className="col-md-3 mb-4">
                                                <Link to="/coupon" className="btn btn-info btn-block py-3">
                                                    <FaTag className="mr-2" /> Mã Giảm Giá
                                                </Link>
                                            </div>
                                            <div className="col-md-3 mb-4">
                                                <Link to="/sale" className="btn btn-success btn-block py-3">
                                                    <FaPercent className="mr-2" /> Sale
                                                </Link>
                                            </div>
                                            <div className="col-md-3 mb-4">
                                                <Link to="/category" className="btn btn-secondary btn-block py-3">
                                                    <FaListAlt className="mr-2" /> Loại Product
                                                </Link>
                                            </div>
                                            <div className="col-md-3 mb-4">
                                                <Link to="/order" className="btn btn-primary btn-block py-3">
                                                    <FaShoppingCart className="mr-2" /> Tổng Số Đơn Hàng
                                                </Link>
                                            </div>
                                            <div className="col-md-3 mb-4">
                                                <Link to="/delivery" className="btn btn-warning btn-block py-3">
                                                    <FaTruck className="mr-2" /> Đơn Hàng Đang Giao
                                                </Link>
                                            </div>
                                            <div className="col-md-3 mb-4">
                                                <Link to="/completedorder" className="btn btn-success btn-block py-3">
                                                    <FaCheckCircle className="mr-2" /> Đơn Hàng Đã Giao
                                                </Link>
                                            </div>
                                            <div className="col-md-3 mb-4">
                                                <Link to="/cancelorder" className="btn btn-danger btn-block py-3">
                                                    <FaTimesCircle className="mr-2" /> Đơn Hàng Đã Hủy
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Đơn hàng gần đây */}
                        <div className="row">
                            <div className="col-12">
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3">
                                        <h6 className="m-0 font-weight-bold text-primary">Đơn hàng gần đây</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-hover" width="100%" cellSpacing="0">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th>Tên khách hàng</th>
                                                        <th>Số điện thoại</th>
                                                        <th>Ngày đặt đơn</th>
                                                        <th>Product đã đặt</th>
                                                        <th>Trạng thái</th>
                                                        <th>Tổng tiền</th>
                                                        <th>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stats.recentOrders.map((order) => (
                                                        <tr key={order._id}>
                                                            <td>{order.id_note?.fullname || order.fullname || 'Không có tên'}</td>
                                                            <td>{order.id_note?.phone || order.phone || 'Không có SĐT'}</td>
                                                            <td>{order.create_time || 'N/A'}</td>
                                                            <td>
                                                                {order.products && order.products.length > 0 ? (
                                                                    <div>
                                                                        <div>
                                                                            <strong>{order.products[0].name_product || order.products[0].id_product?.name_product || 'Product'}</strong>
                                                                            {order.products[0].count && <span> x{order.products[0].count}</span>}
                                                                            {order.products[0].size && <span> (Size: {order.products[0].size})</span>}
                                                                        </div>
                                                                        {order.products.length > 1 && (
                                                                            <span className="text-muted">và {order.products.length - 1} Product khác</span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    'Đang tải thông tin Product...'
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${
                                                                    order.status === '4' ? 'badge-success' : 
                                                                    order.status === '0' ? 'badge-warning' : 
                                                                    order.status === '5' ? 'badge-danger' : 'badge-info'
                                                                }`}>
                                                                    {order.status === '4' ? 'Hoàn thành' : 
                                                                     order.status === '0' ? 'Chờ xác nhận' : 
                                                                     order.status === '5' ? 'Đã hủy' : 
                                                                     order.status === '1' ? 'Đã xác nhận' :
                                                                     order.status === '2' ? 'Đang giao' :
                                                                     order.status === '3' ? 'Đã giao' : 'Không xác định'}
                                                                </span>
                                                            </td>
                                                            <td>{formatCurrency(order.total || 0)}</td>
                                                            <td>
                                                                <Link to={`/order/detail/${order._id}`} className="btn btn-sm btn-primary">
                                                                    Chi tiết
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {stats.recentOrders.length === 0 && (
                                                        <tr>
                                                            <td colSpan="7" className="text-center">Không có đơn hàng nào</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-center mt-3">
                                            <Link to="/order" className="btn btn-outline-primary">Xem tất cả đơn hàng</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;









































