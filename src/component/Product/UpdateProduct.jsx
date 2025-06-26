import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import categoryAPI from '../Api/categoryAPI';
import isEmpty from 'validator/lib/isEmpty'
import productAPI from '../Api/productAPI';

function UpdateProduct(props) {
    const [id] = useState(props.match.params.id)
    const [category, setCategory] = useState([])
    const [gender] = useState(["Unisex", "Male", "Female"])
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    // Thay đổi từ number thành inventoryS, inventoryM, inventoryL
    const [inventoryS, setInventoryS] = useState('0');
    const [inventoryM, setInventoryM] = useState('0');
    const [inventoryL, setInventoryL] = useState('0');
    const [categoryChoose, setCategoryChoose] = useState('');
    const [genderChoose, setGenderChoose] = useState('Unisex');
    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const [fileName, setFileName] = useState("");
    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();


    useEffect(() => {
        const fetchAllData = async () => {
            const ct = await categoryAPI.getAPI()
            const rs = await productAPI.details(id)
            setName(rs.name_product)
            setPrice(rs.price_product)
            setDescription(rs.describe)
            
            // Xử lý số lượng theo size
            if (rs.inventory) {
                setInventoryS(rs.inventory.S || '0')
                setInventoryM(rs.inventory.M || '0')
                setInventoryL(rs.inventory.L || '0')
            } else {
                // Nếu chưa có inventory, sử dụng number để tương thích ngược
                setInventoryS(rs.number || '0')
                setInventoryM('0')
                setInventoryL('0')
            }
            
            setCategoryChoose(rs.id_category)
            setGenderChoose(rs.gender || 'Unisex')
            setImage(rs.image)
            setCategory(ct)
        }
        fetchAllData()
    }, [id])

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    // Cập nhật hàm xử lý số lượng
    const onChangeInventory = (e, setFunction) => {
        const value = e.target.value
        if (!Number.isNaN(value) && Number(value) >= 0) {
            setFunction(value)
        }
    }

    const onChangePrice = (e) => {
        const value = e.target.value
        if (!Number.isNaN(value) && Number(value) > 0) {
            setPrice(value)
        }
    }

    const validateAll = () => {
        let msg = {}
        if (isEmpty(name)) {
            msg.name = "Tên không được để trống"
        }
        if (isEmpty(price)) {
            msg.price = "Giá không được để trống"
        }
        if (isEmpty(description)) {
            msg.description = "Mô tả không được để trống"
        }
        // Kiểm tra ít nhất một size phải có số lượng
        if (inventoryS==="" && inventoryM==="" && inventoryL==="" ) {
            msg.inventory = "Ít nhất một size phải có số lượng"
        }
        if (isEmpty(categoryChoose)) {
            msg.category = "Vui lòng chọn loại"
        }

        setValidationMsg(msg)
        if (Object.keys(msg).length > 0) return false;
        return true;
    }

    const handleCreate = () => {

        const isValid = validateAll();
        if (!isValid) return
        console.log(file)
        addProduct();

    }

    const addProduct = async () => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("image", file);
        formData.append("fileName", fileName);
        formData.append("name", name)
        formData.append("price", price)
        formData.append("category", categoryChoose)
        // Thêm số lượng theo size thay vì number
        formData.append("inventoryS", inventoryS)
        formData.append("inventoryM", inventoryM)
        formData.append("inventoryL", inventoryL)
        formData.append("description", description)
        formData.append("gender", genderChoose)

        console.log(formData);
        
        const response = await productAPI.update(formData)

        if (response.msg === "Bạn đã update thành công") {
            window.scrollTo(0, 0)
        }
        setValidationMsg({ api: response.msg })

    }


    return (
        <div className="page-wrapper">

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Update Product</h4>
                                {
                                    validationMsg.api === "Bạn đã thêm thành công" ?
                                        (
                                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                              <p>{validationMsg.api}</p>
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                        ) :
                                        (
                                            <p style={{ color: 'green' }} className="form-text">{validationMsg.api}</p>
                                        )
                                }


                                <form onSubmit={handleSubmit(handleCreate)}>
                                    <div className="form-group w-50">
                                        <label htmlFor="name">Tên Product</label>
                                        <input type="text" className="form-control" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                        <p className="form-text text-danger">{validationMsg.name}</p>
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="price">Giá Product</label>
                                        <input type="text" className="form-control" id="price" name="price" value={price} onChange={(e) => onChangePrice(e)} required />
                                        <p className="form-text text-danger">{validationMsg.price}</p>
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="description">Mô tả</label>
                                        <input type="text" className="form-control" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                        <p className="form-text text-danger">{validationMsg.description}</p>
                                    </div>
                                    
                                    {/* Thay đổi phần số lượng */}
                                    <div className="form-group w-50">
                                        <label>Số lượng theo size:</label>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <label htmlFor="inventoryS">Size S:</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    id="inventoryS" 
                                                    name="inventoryS" 
                                                    value={inventoryS} 
                                                    onChange={(e) => onChangeInventory(e, setInventoryS)} 
                                                    min="0"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="inventoryM">Size M:</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    id="inventoryM" 
                                                    name="inventoryM" 
                                                    value={inventoryM} 
                                                    onChange={(e) => onChangeInventory(e, setInventoryM)} 
                                                    min="0"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="inventoryL">Size L:</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    id="inventoryL" 
                                                    name="inventoryL" 
                                                    value={inventoryL} 
                                                    onChange={(e) => onChangeInventory(e, setInventoryL)} 
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <p className="form-text text-danger">{validationMsg.inventory}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        {/* <label htmlFor="categories" className="mr-2">Chọn loại:</label> */}
                                        <label htmlFor="categories" className="mr-2">Chọn loại sản phẩm: </label>
                                        <select name="categories" id="categories" value={categoryChoose} onChange={(e) => setCategoryChoose(e.target.value)}>
                                            <option >Chọn loại</option>
                                            {
                                                category && category.map((item, index) => (
                                                    <option value={item._id} key={index} >{item.category}</option>
                                                ))
                                            }

                                        </select>
                                        <p className="form-text text-danger">{validationMsg.category}</p>
                                    </div>

                                    <div className="form-group w-50">
                                        <label htmlFor="gender" className="mr-2">Chọn giới tính:</label>
                                        <select name="gender" id="gender" value={genderChoose} onChange={(e) => setGenderChoose(e.target.value)}>
                                            {
                                                gender && gender.map((item, index) => (
                                                    <option value={item} key={index}>{item}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group w-50">
                                        <label>Hình Ảnh</label>
                                        <input type="file" className="form-control-file" name="file" onChange={saveFile} />
                                    </div>

                                    <div className="form-group w-50">
                                        <label>Hình Ảnh Cũ</label>
                                        <img src={image} alt="" style={{ width: '70px' }} />
                                    </div>


                                    <button type="submit" className="btn btn-primary">Update Product</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        </div>
    );
}

export default UpdateProduct;
