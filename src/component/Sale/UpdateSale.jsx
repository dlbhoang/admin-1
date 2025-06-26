import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import productAPI from '../Api/productAPI';
import SaleAPI from '../Api/SaleAPI';
import { useParams } from 'react-router';

const defaultValues = {
    promotion: '',
    describe: '',
};

function UpdateSale(props) {

    const { id } = useParams()

    const [showMessage, setShowMessage] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues });
    const onSubmit = async (data) => {

        const body = {
            promotion: promotion,
            describe: describe,
            status: status,
            id_product: selectProduct,
            start: startDate,
            end: endDate
        }
        console.log("du lieu",body);
        

        const response = await SaleAPI.updateSale(id, body)

        setShowMessage(response)

    };

    const [promotion, setPromotion] = useState('')
    const [describe, setDescribe] = useState('')
    const [status, setStatus] = useState('')
    const [selectProduct, setSelectProduct] = useState("")
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [product, setProduct] = useState([])

    useEffect(() => {

        const fetchData = async () => {

            const response = await productAPI.getAll()
            setProduct(response)

            const resDetail = await SaleAPI.detailSale(id)

            console.log(resDetail)

            setPromotion(resDetail.promotion)
            setDescribe(resDetail.describe)
            setStatus(resDetail.status ? "true" : "false")
            setSelectProduct(resDetail.id_product)
            
            // Chuyển đổi chuỗi ngày thành đối tượng Date
            if (resDetail.start) {
                setStartDate(new Date(resDetail.start))
            }
            
            if (resDetail.end) {
                setEndDate(new Date(resDetail.end))
            }
        }

        fetchData()

    }, [id])

    return (
        <div className="page-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Update Sale</h4>
                                {
                                    showMessage === "Bạn đã cập nhật thành công" ?
                                        (
                                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                {showMessage}
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                        ) :
                                        (
                                            <p className="form-text text-danger">{showMessage}</p>
                                        )
                                }


                                <form onSubmit={handleSubmit(onSubmit)}>
                                
                                    <div className="form-group w-50">
                                        <label htmlFor="name">Khuyến Mãi (%)</label>
                                        <input type="text" className="form-control" id="promotion" 
                                        {...register('promotion')} 
                                        value={promotion} 
                                        onChange={(e) => setPromotion(e.target.value)} />
                                        {errors.promotion && errors.promotion.type === "required" && <p className="form-text text-danger">Khuyến Mãi không được để trống</p>}
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="description">Mô tả</label>
                                        <input type="text" className="form-control" id="describe"
                                        {...register('describe')}
                                        value={describe} 
                                        onChange={(e) => setDescribe(e.target.value)} />
                                        {errors.describe && errors.describe.type === "required" && <p className="form-text text-danger">Mô tả không được để trống</p>}
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="description">Trạng Thái</label>
                                        <div className="form-check">
                                        <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="true" checked={status === "true"} onClick={(e) => setStatus(e.target.value)} />
                                        <label className="form-check-label" htmlFor="gridRadios1">
                                            Hoạt Động
                                        </label>
                                        </div>
                                        <div className="form-check">
                                        <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="false" checked={status === "false"} onClick={(e) => setStatus(e.target.value)} />
                                        <label className="form-check-label" htmlFor="gridRadios2">
                                            Ngưng Hoạt Động
                                        </label>
                                        </div>
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="description">Ngày bắt đầu</label>
                                        <br />
                                        <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} />
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="description">Ngày kết thúc</label>
                                        <br />
                                        <DatePicker className="form-control" selected={endDate} onChange={(date) => setEndDate(date)} />
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="product">Product</label>
                                        <select className="form-control" value={selectProduct} onChange={(e) => setSelectProduct(e.target.value)}>
                                            {
                                                product && product.map(value => (
                                                    <option value={value._id} key={value._id}>{value.name_product}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Update Sale</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        </div>
    );
}

export default UpdateSale;
