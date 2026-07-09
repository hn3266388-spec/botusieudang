import { useState, useEffect } from 'react';
import { paymentApi } from '../api/paymentApi';

export default function AdminPayment() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    paymentApi.getAllPayments().then(res => setPayments(res.data || []));
  }, []);

  return (
    <div>
      <h2>Quản lý Thanh toán</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>ID</th><th>Order</th><th>User</th><th>Số tiền</th><th>Trạng thái</th><th>Ngân hàng</th></tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.orderId}</td>
              <td>{p.username}</td>
              <td>{p.amount?.toLocaleString()}đ</td>
              <td>{p.status}</td>
              <td>{p.bankCode || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}