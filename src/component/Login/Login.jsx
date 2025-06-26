import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'validator/lib/isEmpty';
import { useForm } from "react-hook-form";
import userAPI from '../Api/userAPI';
import { AuthContext } from '../context/Auth';

function Login() {
    const { addLocal } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationMsg, setValidationMsg] = useState('');
    const { handleSubmit } = useForm();
    let history = useHistory();

    const validateAll = () => {
        let msg = {};
        if (isEmpty(email)) {
            msg.email = "Email không được để trống";
        }
        if (isEmpty(password)) {
            msg.password = "Password không được để trống";
        }
        setValidationMsg(msg);
        return Object.keys(msg).length === 0;
    };

    const handleLogin = async () => {
        if (!validateAll()) return;

        const user = { email, password };

        try {
            const response = await userAPI.login(user);
            console.log("Response từ API:", response);

            if (response.msg === "Đăng nhập thành công") {
                console.log("Dữ liệu user:", response.user);

                // Kiểm tra nếu là admin từ biến môi trường
                if (response.user.email === 'admin@gmail.com') {
                    console.log("Đăng nhập với tài khoản admin đặc biệt");
                    addLocal(response.jwt, response.user);
                    history.push('/user');
                    return;
                }

                if (response.user && response.user.id_permission) {
                    const permission = response.user.id_permission;
                    console.log("Quyền user:", permission);

                    // Kiểm tra quyền trước khi lưu thông tin và chuyển hướng
                    if (permission === "Nhân Viên" || permission === "6087dcb5f269113b3460fce4" || permission === "Admin") {
                        // Lưu thông tin đăng nhập
                        addLocal(response.jwt, response.user);
                        console.log("➡ Chuyển hướng...");

                        // Chuyển hướng dựa trên quyền
                        if (permission === "Nhân Viên") {
                            console.log("➡ Chuyển hướng /customer");
                            history.push('/customer');
                        } else if (permission === "6087dcb5f269113b3460fce4" || permission === "Admin") {
                            console.log("➡ Chuyển hướng /user");
                            history.push('/user');
                        }
                    } else {
                        setValidationMsg({ api: "Bạn không có quyền truy cập" });
                    }
                } else {
                    setValidationMsg({ api: "Dữ liệu User không hợp lệ (Thiếu quyền)" });
                }
            } else {
                setValidationMsg({ api: response.msg });
            }
        } catch (error) {
            console.error("❌ Lỗi đăng nhập:", error);
            setValidationMsg({ api: "Lỗi kết nối server. Vui lòng thử lại sau." });
        }
    };
    

    return (
        <div className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative"
             style={{ background: 'url(../assets/images/big/auth-bg.jpg) no-repeat center center' }}>
            <div className="auth-box row">
                <div className="col-lg-7 col-md-5 modal-bg-img"
                     style={{ backgroundImage: 'url(../assets/images/big/3.jpg)' }}>
                </div>
                <div className="col-lg-5 col-md-7 bg-white">
                    <div className="p-3">
                        <div className="text-center">
                            <img src="../assets/images/big/icon.png" alt="wrapkit" />
                        </div>
                        <h2 className="mt-3 text-center">Sign In</h2>

                        {validationMsg.api && <p className="form-text text-danger">{validationMsg.api}</p>}

                        <form className="mt-4" onSubmit={handleSubmit(handleLogin)}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="text-dark" htmlFor="uname">Email</label>
                                        <input className="form-control" name="email" type="text"
                                               placeholder="Enter your email"
                                               value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <p className="form-text text-danger">{validationMsg.email}</p>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label className="text-dark" htmlFor="pwd">Password</label>
                                        <input className="form-control" name="password" type="password"
                                               placeholder="Enter your password"
                                               value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <p className="form-text text-danger">{validationMsg.password}</p>
                                    </div>
                                </div>
                                <div className="col-lg-12 text-center">
                                    <button type="submit" className="btn btn-block btn-dark">Sign In</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
