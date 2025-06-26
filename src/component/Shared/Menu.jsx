import React, { useState, useContext } from 'react';
import { NavLink, Redirect } from "react-router-dom";
import { AuthContext } from '../context/Auth'

function Menu() {
  const { user, jwt } = useContext(AuthContext);

  const [menu] = useState([
    { item: "Customer" },
    { item: "Coupon" },
    { item: "Product" },
    { item: "Sale" },
    { item: "Category" },
    { item: "Order" },
    { item: "ConfirmOrder" },
    { item: "Delivery" },
    { item: "ConfirmDelivery" },
    { item: "CompletedOrder" },
    { item: "CancelOrder" },
    { item: "Comment" },
    // { item: "User" },  // Delete hoặc comment dòng này
    // { item: "Permission" },
  ]);

  return (
    <div>
      {
        jwt && user ? (
          <aside className="left-sidebar" data-sidebarbg="skin6">
            <div className="scroll-sidebar" data-sidebarbg="skin6">
              <nav className="sidebar-nav">
                <ul id="sidebarnav">
                  <li className="sidebar-item d-flex align-items-center justify-content-center pt-3 pb-4">
                    <h3 className="text-primary font-weight-bold">ADMIN PANEL</h3>
                  </li>
                  
                  {/* Thêm Dashboard ở đầu menu */}
                  <li className="sidebar-item">
                    <NavLink to="/dashboard" className="" style={{"padding":"10px 15px",marginLeft:26,  borderRadius:8}} activeClassName="border border-info">
                      <i className="fas fa-chart-line"></i>
                      <span className="hide-menu ml-2">Dashboard</span>
                    </NavLink>
                  </li>
                  
                  <li className="list-divider"></li>
                  {/* <li className="nav-small-cap"><span className="hide-menu">Quản lý hệ thống</span></li> */}
                  <li className="sidebar-item">
                    <a className="sidebar-link has-arrow" href="#" aria-expanded="false">
                      <i data-feather="grid" className="feather-icon"></i>
                      <span className="hide-menu">Quản lý dữ liệu</span>
                    </a>
                    <ul aria-expanded="false" style={{overflowY:"scroll", height:500}} className="collapse first-level base-level-line ">
                      {
                        menu.map((item, index) => (
                          <li className="sidebar-item" key={index}>
                            <NavLink to={`/${item.item.toLowerCase()}`} className="sidebar-link" activeClassName="active">
                              <i className="mr-2 fas fa-circle text-primary" style={{ fontSize: '8px' }}></i>
                              {item.item}
                            </NavLink>
                          </li>
                        ))
                      }
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        ) : (
          <Redirect to="/" />
        )
      }
    </div>
  );
}

export default Menu;
