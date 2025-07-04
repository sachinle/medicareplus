<template>
  <div class="confirmation-page">
    <div class="container">
      <div class="confirmation-card">
        <div class="premium-confirmation-icon">
                <img src="https://cdn.dribbble.com/userupload/23589345/file/original-3facc6dbca53f39fa3175635da27a61a.gif" 
                     alt="Success" 
                     class="success-gif">
              </div>
        <h1 class="confirmation-title">Payment Successful!</h1>
        <p class="confirmation-text">
          Thank you for your order. Your payment of Rs {{ amount }} has been processed successfully.
        </p>
        <p class="confirmation-details">
          Order ID: #{{ orderId }}<br>
          Estimated Delivery: {{ deliveryDate }}
        </p>
        <div class="confirmation-actions">
          <router-link to="/products" class="btn continue-btn">
            Continue Shopping
          </router-link>
          
          <button @click="downloadInvoice" class="btn invoice-btn">
            <i class="fas fa-download"></i> Download Invoice
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { jsPDF } from 'jspdf';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      orderId: this.generateOrderId(),
      deliveryDate: this.getDeliveryDate(),
      amount: this.$route.query.amount || '0.00',
      items: [],
      storeInfo: {
        name: "MediCare+",
        address: "Rathinam Technical Campus, Coimbatore, Tamil Nadu 641021",
        phone: "+91 9876543210",
        email: "support@medicareplus.com",
        gstin: "22ABCDE1234F1Z5"
      }
    }
  },
  created() {
    // Clear the cart when this page is loaded
    this.clearCart();
    
    // Parse the items from route query
    if (this.$route.query.items) {
      try {
        this.items = JSON.parse(this.$route.query.items);
      } catch (e) {
        console.error('Error parsing items:', e);
        this.items = [];
      }
    }
  },
  methods: {
    ...mapActions(['clearCart']), // Add this to map the clearCart action
    generateOrderId() {
      return 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    },
    getDeliveryDate() {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    },
    downloadInvoice() {
      const doc = new jsPDF();

      // Store Info
      doc.setFontSize(20).setTextColor(106, 27, 154);
      doc.text(this.storeInfo.name, 105, 20, { align: 'center' });

      doc.setFontSize(10).setTextColor(96, 125, 139);
      doc.text(this.storeInfo.address, 105, 30, { align: 'center' });
      doc.text(`Phone: ${this.storeInfo.phone} | Email: ${this.storeInfo.email}`, 105, 35, { align: 'center' });
      doc.text(`GSTIN: ${this.storeInfo.gstin}`, 105, 40, { align: 'center' });

      // Invoice Title
      doc.setFontSize(16).setTextColor(106, 27, 154);
      doc.text('TAX INVOICE', 105, 50, { align: 'center' });
      doc.setDrawColor(96, 125, 139);
      doc.line(20, 55, 190, 55);

      // Order Details
      doc.setFontSize(10).setTextColor(33, 33, 33);
      doc.text(`Order ID: ${this.orderId}`, 20, 65);
      doc.text(`Order Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 70);
      doc.text(`Order Time: ${new Date().toLocaleTimeString('en-IN')}`, 20, 75);

      // Table Header
      doc.setFillColor(232, 234, 246);
      doc.rect(20, 90, 170, 10, 'F');
      doc.setFontSize(10).setTextColor(106, 27, 154).setFont(undefined, 'bold');
      doc.text('S.No', 25, 96);
      doc.text('Description', 40, 96);
      doc.text('Price', 120, 96, { align: 'right' });
      doc.text('Qty', 150, 96, { align: 'center' });
      doc.text('Amount', 190, 96, { align: 'right' });
      doc.setFont(undefined, 'normal').setTextColor(33, 33, 33);

      // Table Body - Fixed to properly use this.items
      let y = 105;
      let subtotal = 0;

      this.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Ensure item.title exists and limit length
        const title = item.title ? (item.title.length > 50 ? item.title.substring(0, 47) + '...' : item.title) : '';

        doc.text(`${index + 1}`, 25, y);
        doc.text(title, 40, y);
        doc.text(`Rs ${item.price ? item.price.toFixed(2) : '0.00'}`, 120, y, { align: 'right' });
        doc.text(`${item.quantity || 1}`, 150, y, { align: 'center' });
        doc.text(`Rs ${itemTotal.toFixed(2)}`, 190, y, { align: 'right' });

        y += 7;
      })
      // Summary
      const gstRate = 18
      const gstAmount = (subtotal * gstRate) / 100
      const shipping = 0
      const total = subtotal + gstAmount + shipping

      doc.setDrawColor(96, 125, 139).line(20, y, 190, y)
      y += 10

      const rightAlign = (label, value, lineY, bold = false) => {
        if (bold) doc.setFont(undefined, 'bold')
        doc.text(label, 150, lineY)
        doc.text(`Rs ${value.toFixed(2)}`, 190, lineY, { align: 'right' })
        if (bold) doc.setFont(undefined, 'normal')
      }

      rightAlign('Subtotal:', subtotal, y); y += 7
      rightAlign(`GST (${gstRate}%):`, gstAmount, y); y += 7
      rightAlign('Shipping:', shipping, y); y += 7
      rightAlign('Total:', total, y, true); y += 10

      // Footer
      doc.setFontSize(12).setTextColor(106, 27, 154)
      doc.text('Thank you for your purchase!', 105, y, { align: 'center' })
      y += 7

      doc.setFontSize(10).setTextColor(96, 125, 139)
      doc.text('Please contact us if you have any questions', 105, y, { align: 'center' })

      // Save PDF
      doc.save(`invoice_${this.orderId}.pdf`)
    }
  }
}
</script>

<style scoped>
.confirmation-page {
  padding: 4rem 0;
  background-color: #f8fafc;
  min-height: calc(100vh - 120px);
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.confirmation-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9d5ff;
  text-align: center;
}

.confirmation-icon {
  margin-bottom: 2rem;
}

.success-gif {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.confirmation-title {
  color: #28a745;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.confirmation-text {
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.confirmation-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 2rem;
  display: inline-block;
}

.confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.continue-btn {
  background: #6a1b9a;
  color: white;
  border: none;
}

.continue-btn:hover {
  background: #7b1fa2;
  transform: translateY(-2px);
}



.invoice-btn {
  background: #10b981;
  color: white;
  border: none;
}

.invoice-btn:hover {
  background: #34d399;
  transform: translateY(-2px);
}

.invoice-btn i {
  margin-right: 0.5rem;
}

@media (max-width: 576px) {
  .confirmation-card {
    padding: 2rem 1.5rem;
  }
  
  .confirmation-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn {
    width: 100%;
  }
}
</style>