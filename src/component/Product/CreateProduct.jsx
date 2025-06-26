import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import categoryAPI from '../Api/categoryAPI';
import isEmpty from 'validator/lib/isEmpty'
import productAPI from '../Api/productAPI';

function CreateProduct(props) {
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
    const [fileName, setFileName] = useState("");
    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();


    useEffect(() => {
        const fetchAllData = async () => {
            const ct = await categoryAPI.getAPI()
            setCategory(ct)
        }
        fetchAllData()
    }, [])

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].fileName);
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
        const priceRegex = /^[1-9](?=.+[0-9]).{0,}$/
        let msg = {}
        if (isEmpty(name)) {
            msg.name = "Tên không được để trống"
        }
        if (isEmpty(price)) {
            msg.price = "Giá không được để trống"
        } else if (!priceRegex.test(price)) {
            msg.price = "Giá sai định dạng"
        }
        if (isEmpty(description)) {
            msg.description = "Mô tả không được để trống"
        }
        // Kiểm tra ít nhất một size phải có số lượng
        if (isEmpty(inventoryS) && isEmpty(inventoryM) && isEmpty(inventoryL)) {
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
        formData.append("image", file);
        formData.append("fileName", fileName);
        formData.append("name", name)
        formData.append("price", price)
        formData.append("category", categoryChoose)
        // Thêm số lượng theo size
        formData.append("inventoryS", inventoryS)
        formData.append("inventoryM", inventoryM)
        formData.append("inventoryL", inventoryL)
        formData.append("description", description)
        formData.append("gender", genderChoose)
        
     
console.log(file);

   
        const response = await productAPI.create(formData,{
                "Content-Type": "multipart/form-data"
            })

        if (response.statuscode ===200) {
            setName('');
            setPrice('');
            setDescription('');
            setInventoryS('0');
            setInventoryM('0');
            setInventoryL('0');
            setCategoryChoose('');
            setGenderChoose('Unisex');
            setFile('');
            setFileName('');
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
                                <h4 className="card-title">Create Product</h4>
                                {
                                    validationMsg.api === "Bạn đã thêm thành công" ?
                                        (
                                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                {validationMsg.api}
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                        ) :
                                        (
                                            <p className="form-text text-danger">{validationMsg.api}</p>
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
                                        <label htmlFor="categories" className="mr-2">Chọn loại sản phẩm:</label>
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

                                    <button type="submit" className="btn btn-primary">Create Product</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer text-center text-muted">
              
            </footer>
        </div>
    );
}

export default CreateProduct;
