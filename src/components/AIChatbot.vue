<template>
  <div class="ai-chatbot-container">
    <button 
      class="chatbot-toggle"
      @click="toggleChatbot"
      :class="{ 'active': isOpen }"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span v-if="isOpen">Close</span>
    </button>

    <div class="chatbot-window" :class="{ 'open': isOpen }">
      <div class="chatbot-header">
        <h3>MediCare+ AI Assistant</h3>
        <button @click="toggleChatbot" class="close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="chatbot-messages" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message', message.type]"
        >
          <div class="message-content">
            <div v-if="message.type === 'bot'" class="bot-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16V16.01" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="text" v-html="message.text"></div>
          </div>
          <div v-if="message.products && message.products.length" class="product-suggestions">
            <h4>Suggested Products:</h4>
            <div class="products-grid">
              <div 
                v-for="product in message.products" 
                :key="product.id"
                class="product-card"
                @click="viewProduct(product)"
              >
                <div class="product-image">
                  <img :src="product.image" :alt="product.title">
                </div>
                <div class="product-info">
                  <h5>{{ product.title }}</h5>
                  <div class="product-price">₹{{ product.price }}</div>
                  <button class="add-to-cart-btn" @click.stop="addToCart(product)">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isTyping" class="message bot">
          <div class="message-content">
            <div class="bot-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16V16.01" stroke="#6a1b9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chatbot-input">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Ask about our products..."
        />
        <button @click="sendMessage">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AIChatbot',
  props: {
    currentProduct: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isOpen: false,
      userInput: '',
      messages: [
        {
          type: 'bot',
          text: 'Hello! I\'m Leo, your MediCare+ AI assistant. How can I help you with our healthcare products today?',
          products: []
        }
      ],
      isTyping: false,
      products: [],
      isLoading: false
    };
  },
  async created() {
    // Load products data
    try {
      const response = await import('@/assets/products.json');
      this.products = response.default || response;
    } catch (error) {
      console.error('Error loading products:', error);
    }
  },
  methods: {
    ...mapActions(['addItemToCart']),
    toggleChatbot() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;

      // Add user message
      this.messages.push({
        type: 'user',
        text: this.userInput,
        products: []
      });

      const userQuestion = this.userInput;
      this.userInput = '';
      this.isLoading = true;
      this.isTyping = true;
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      // Simulate typing delay
      setTimeout(() => {
        try {
          const response = this.generateLocalResponse(userQuestion);
          this.messages.push({
            type: 'bot',
            text: typeof response === 'string' ? response : response.text,
            products: typeof response === 'object' ? response.products : []
          });
        } catch (error) {
          console.error('Error generating response:', error);
          this.showErrorFallback(userQuestion);
        } finally {
          this.isLoading = false;
          this.isTyping = false;
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      }, 800); // Simulate typing delay
    },
    generateLocalResponse(question) {
      // First check if it's a product-specific question
      if (this.currentProduct) {
        const productResponse = this.handleProductSpecificQuestion(question);
        if (productResponse) return productResponse;
      }

      // Check for direct questions
      const directResponse = this.handleDirectQuestions(question);
      if (directResponse) return directResponse;

      // If we don't understand the question, show help
      return this.showHelpResponse(question);
    },
    showHelpResponse(question) {
      const lowerQuestion = question.toLowerCase();
      
      // Try to find similar questions
      if (lowerQuestion.includes('product') || lowerQuestion.includes('item')) {
        return {
          text: 'Here are some of our popular healthcare products:',
          products: this.getRandomProducts(5)
        };
      }
      
      if (lowerQuestion.includes('help') || lowerQuestion.includes('support')) {
        return {
          text: 'I can help with information about our products, services, and general healthcare topics. ' +
                'Try asking about specific products, prices, or recommendations based on your needs.',
          products: []
        };
      }

      // Default help response
      return {
        text: "I'm here to help with MediCare+ products and services. Here are some things you can ask me:<br><br>" +
              "- Tell me about [product name]<br>" +
              "- What's the price of [product]<br>" +
              "- Recommend products for [health concern]<br>" +
              "- What are your delivery options?<br>" +
              "- How do I contact support?<br><br>" +
              "For medical advice, please consult a healthcare professional.",
        products: this.getRandomProducts(3)
      };
    },
    handleProductSpecificQuestion(question) {
      const lowerQuestion = question.toLowerCase();
      
      if (!this.currentProduct) return null;
      
      if (lowerQuestion.includes('what is') || lowerQuestion.includes('tell me about')) {
        return `This is our <strong>${this.currentProduct.title}</strong>. ${this.currentProduct.description}`;
      }
      else if (lowerQuestion.includes('price') || lowerQuestion.includes('cost')) {
        return `The price of <strong>${this.currentProduct.title}</strong> is ₹${this.currentProduct.price}`;
      }
      else if (lowerQuestion.includes('use') || lowerQuestion.includes('how to') || lowerQuestion.includes('dosage')) {
        return this.generateUsageInstructions();
      }
      else if (lowerQuestion.includes('benefit') || lowerQuestion.includes('help with')) {
        return this.generateBenefits();
      }
      else if (lowerQuestion.includes('side effect') || lowerQuestion.includes('risk')) {
        return this.generateSafetyInfo();
      }
      else if (lowerQuestion.includes('similar') || lowerQuestion.includes('alternative')) {
        return {
          text: `Here are some products similar to <strong>${this.currentProduct.title}</strong>:`,
          products: this.getSimilarProducts(this.currentProduct, 3)
        };
      }
      
      return null;
    },
    generateUsageInstructions() {
      let response = `For <strong>${this.currentProduct.title}</strong>, the recommended usage is: `;
      
      if (this.currentProduct.category.includes('pharma') || this.currentProduct.category.includes('medicine')) {
        response += 'Take 1-2 capsules daily with water, or as directed by your physician.';
      } else if (this.currentProduct.category.includes('equipment')) {
        response += 'Please refer to the user manual for proper usage instructions.';
      } else if (this.currentProduct.category.includes('supplement')) {
        response += 'Take 1 tablet daily with meals, or as directed by your healthcare provider.';
      } else {
        response += 'Follow the instructions on the product packaging.';
      }
      
      return response + ' For personalized advice, please consult your doctor.';
    },
    generateBenefits() {
      let response = `<strong>${this.currentProduct.title}</strong> can help with: `;
      
      if (this.currentProduct.category.includes('pain')) {
        response += 'relieving pain and inflammation.';
      } else if (this.currentProduct.category.includes('vitamin')) {
        response += 'boosting immunity and overall health.';
      } else if (this.currentProduct.category.includes('skin')) {
        response += 'improving skin health and appearance.';
      } else if (this.currentProduct.category.includes('digest')) {
        response += 'supporting digestive health and gut function.';
      } else if (this.currentProduct.category.includes('heart')) {
        response += 'supporting cardiovascular health.';
      } else {
        response += 'various health benefits as described in the product details.';
      }
      
      return response;
    },
    generateSafetyInfo() {
      let response = `<strong>${this.currentProduct.title}</strong> is generally safe when used as directed. `;
      
      if (this.currentProduct.category.includes('pharma') || this.currentProduct.category.includes('medicine')) {
        response += 'Some users may experience mild side effects like nausea or dizziness. ';
      } else if (this.currentProduct.category.includes('supplement')) {
        response += 'Dietary supplements may cause reactions in some individuals. ';
      }
      
      return response + 'Consult your doctor if you have any concerns or experience adverse effects.';
    },
    handleDirectQuestions(question) {
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
        return {
          text: 'Hello! I\'m Leo, your MediCare+ AI assistant. How can I help you with our healthcare products today?',
          products: []
        };
      }
      else if (lowerQuestion.includes('recommend') || lowerQuestion.includes('suggest')) {
        return this.handleRecommendationRequest(lowerQuestion);
      }
      else if (lowerQuestion.includes('delivery') || lowerQuestion.includes('shipping')) {
        return {
          text: 'We offer several delivery options:<br>' +
                '- Standard delivery: 3-5 business days (FREE for orders over ₹500)<br>' +
                '- Express delivery: Next business day (₹100)<br>' +
                '- Priority delivery: Same day (₹200, order before 2pm)<br><br>' +
                'Delivery times may vary based on location and product availability.',
          products: []
        };
      }
      else if (lowerQuestion.includes('return') || lowerQuestion.includes('refund')) {
        return {
          text: 'Our return policy:<br>' +
                '- 30-day return window for unopened products with original packaging<br>' +
                '- Refunds processed within 5-7 business days<br>' +
                '- For defective products, please contact support@medicareplus.com<br><br>' +
                'Note: Prescription medications and personal care items cannot be returned.',
          products: []
        };
      }
      else if (lowerQuestion.includes('contact') || lowerQuestion.includes('support')) {
        return {
          text: 'Contact options:<br>' +
                '- Email: support@medicareplus.com<br>' +
                '- Phone: +91 9876543210 (9am-9pm, 7 days a week)<br>' +
                '- Live chat: Available on our website<br><br>' +
                'For medical emergencies, please contact local emergency services.',
          products: []
        };
      }
      else if (lowerQuestion.includes('product') || lowerQuestion.includes('item')) {
        return {
          text: 'Here are some of our popular healthcare products:',
          products: this.getRandomProducts(5)
        };
      }
      else if (lowerQuestion.includes('discount') || lowerQuestion.includes('offer')) {
        return {
          text: 'Current promotions:<br>' +
                '- 15% off on all diabetes care products (code: DIABETES15)<br>' +
                '- Buy 1 Get 1 Free on selected vitamins<br>' +
                '- Free shipping on orders over ₹500<br><br>' +
                'Check our website for the latest offers!',
          products: this.getRandomProducts(3)
        };
      }
      else if (lowerQuestion.includes('payment') || lowerQuestion.includes('pay')) {
        return {
          text: 'We accept various payment methods:<br>' +
                '- Credit/Debit cards (Visa, Mastercard, Amex)<br>' +
                '- Net Banking<br>' +
                '- UPI (PhonePe, Google Pay, Paytm)<br>' +
                '- EMI options available (select banks)<br>' +
                '- Cash on Delivery (₹50 charge)',
          products: []
        };
      }
      
      return null;
    },
    handleRecommendationRequest(question) {
      const categories = [
        { keywords: ['pain', 'headache', 'backache'], name: 'pain relief' },
        { keywords: ['vitamin', 'immune', 'immunity'], name: 'vitamins' },
        { keywords: ['skin', 'acne', 'eczema'], name: 'skin care' },
        { keywords: ['heart', 'cardio', 'blood pressure'], name: 'heart health' },
        { keywords: ['diabetes', 'blood sugar'], name: 'diabetes care' },
        { keywords: ['digest', 'stomach', 'gut'], name: 'digestive health' },
        { keywords: ['sleep', 'insomnia'], name: 'sleep aids' },
        { keywords: ['stress', 'anxiety'], name: 'stress relief' },
        { keywords: ['allergy', 'sinus'], name: 'allergy relief' },
        { keywords: ['cold', 'flu', 'cough'], name: 'cold & flu' }
      ];
      
      const matchedCategory = categories.find(cat => 
        cat.keywords.some(keyword => question.includes(keyword))
      );
      
      if (matchedCategory) {
        const filteredProducts = this.products
          .filter(p => p.category.includes(matchedCategory.name) || 
                      p.title.toLowerCase().includes(matchedCategory.keywords[0]) ||
                      p.description.toLowerCase().includes(matchedCategory.keywords[0]))
          .slice(0, 3);
        
        if (filteredProducts.length > 0) {
          return {
            text: `Based on your interest in ${matchedCategory.name}, here are some products you might find helpful:`,
            products: filteredProducts
          };
        }
      }
      
      // Default recommendation
      return {
        text: 'Here are some of our popular healthcare products:',
        products: this.getRandomProducts(5)
      };
    },
    getRandomProducts(count) {
      return [...this.products].sort(() => 0.5 - Math.random()).slice(0, count);
    },
    getSimilarProducts(product, count) {
      return this.products
        .filter(p => p.id !== product.id && p.category === product.category)
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    },
    showErrorFallback(question) {
      return this.showHelpResponse(question);
    },
    viewProduct(product) {
      this.$router.push(`/products/${product.id}`);
      this.isOpen = false;
    },
    addToCart(product) {
      this.addItemToCart({
        ...product,
        quantity: 1
      });
      this.messages.push({
        type: 'bot',
        text: `${product.title} has been added to your cart!`,
        products: []
      });
    }
  }
};
</script>

<style scoped>

.ai-chatbot-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.chatbot-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #6a1b9a;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(106, 27, 154, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.chatbot-toggle:hover {
  background-color: #7b1fa2;
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(106, 27, 154, 0.4);
}

.chatbot-toggle.active {
  background-color: #ff5722;
}

.chatbot-toggle svg {
  width: 24px;
  height: 24px;
}

.chatbot-toggle span {
  display: none;
}

.chatbot-window {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  max-height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform: translateY(20px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.chatbot-window.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.chatbot-header {
  padding: 1rem;
  background-color: #6a1b9a;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatbot-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.chatbot-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #f8fafc;
}

.message {
  margin-bottom: 1rem;
}

.message-content {
  display: flex;
  max-width: 80%;
}

.message.user {
  justify-content: flex-end;
}

.message.user .message-content {
  background-color: #6a1b9a;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 18px 18px 0 18px;
}

.message.bot {
  justify-content: flex-start;
}

.message.bot .message-content {
  background-color: white;
  color: #2d3748;
  padding: 0.75rem 1rem;
  border-radius: 18px 18px 18px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.bot-avatar {
  margin-right: 0.75rem;
}

.bot-avatar svg {
  width: 24px;
  height: 24px;
}

.text {
  line-height: 1.5;
}

.text ul {
  padding-left: 1rem;
  margin: 0.5rem 0;
}

.text li {
  margin-bottom: 0.25rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  height: 24px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #6a1b9a;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
}

.product-suggestions {
  margin-top: 1rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.product-suggestions h4 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.product-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: white;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 50px;
  height: 50px;
  background-color: #f8fafc;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  flex: 1;
}

.product-info h5 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6a1b9a;
  margin: 0.25rem 0;
}

.add-to-cart-btn {
  width: 100%;
  padding: 0.25rem;
  font-size: 0.7rem;
  background-color: #6a1b9a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-to-cart-btn:hover {
  background-color: #7b1fa2;
}

.chatbot-input {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  background-color: white;
}

.chatbot-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
}

.chatbot-input input:focus {
  border-color: #6a1b9a;
  box-shadow: 0 0 0 2px rgba(106, 27, 154, 0.2);
}

.chatbot-input button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #6a1b9a;
  color: white;
  border: none;
  margin-left: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chatbot-input button:hover {
  background-color: #7b1fa2;
}

.chatbot-input button svg {
  width: 20px;
  height: 20px;
}

/* Responsive */
@media (max-width: 480px) {
  .chatbot-window {
    width: calc(100% - 40px);
    right: 20px;
    bottom: 70px;
    max-height: 60vh;
  }
  
  .chatbot-toggle {
    width: 50px;
    height: 50px;
    bottom: 1rem;
    right: 1rem;
  }
}
</style>``