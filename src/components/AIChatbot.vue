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
      isLoading: false,
      apiEndpoint: process.env.VUE_APP_OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions'
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

      try {
        // First try to answer from local knowledge
        const localResponse = this.handleDirectQuestions(userQuestion) || 
                             this.handleProductSpecificQuestion(userQuestion);
        
        if (localResponse) {
          this.messages.push({
            type: 'bot',
            text: typeof localResponse === 'string' ? localResponse : localResponse.text,
            products: typeof localResponse === 'object' ? localResponse.products : []
          });
          return;
        }

        // Only call OpenAI if we can't answer locally
        if (process.env.VUE_APP_OPENAI_API_KEY) {
          await this.generateResponse(userQuestion);
        } else {
          throw new Error('API key not configured');
        }
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
    },
    async generateResponse(question) {
      // First check if it's a product-specific question
      if (this.currentProduct) {
        const productResponse = this.handleProductSpecificQuestion(question);
        if (productResponse) {
          this.messages.push({
            type: 'bot',
            text: productResponse,
            products: []
          });
          return;
        }
      }

      // Check if it's a general question we can handle directly
      const directResponse = this.handleDirectQuestions(question);
      if (directResponse) {
        this.messages.push({
          type: 'bot',
          text: directResponse.text,
          products: directResponse.products
        });
        return;
      }

      // For other questions, use OpenAI API
      const response = await this.callOpenAI(question);
      const mentionedProducts = this.extractProductMentions(response);
      
      this.messages.push({
        type: 'bot',
        text: response,
        products: mentionedProducts
      });
    },
    async callOpenAI(question) {
      const prompt = this.createPrompt(question);
      
      try {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are Leo, an AI assistant for MediCare+ healthcare products. Provide concise, accurate information about products and related health topics only."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 300
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
      } catch (error) {
        console.error('API call failed:', error);
        throw error;
      }
    },
    createPrompt(question) {
      const productContext = this.currentProduct ? 
        `Current product context: ${this.currentProduct.title} - ${this.currentProduct.description}. ` : '';
      
      const productsList = this.products.slice(0, 10).map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description.substring(0, 100),
        category: p.category
      }));

      return `
        You are Leo, the AI assistant for MediCare+, a healthcare products company. 
        Your role is to provide helpful information ONLY about MediCare+ products and related healthcare advice.
        
        ${productContext}
        
        Available products information: ${JSON.stringify(productsList)}
        
        Guidelines:
        1. Only answer questions related to healthcare products, medicines, and general health tips relevant to our products
        2. For product questions, provide accurate information based on the product details
        3. For health advice, keep it general and recommend consulting a doctor
        4. If asked about non-healthcare topics, politely decline and refocus on healthcare products
        5. For product recommendations, suggest specific MediCare+ products when relevant
        6. Keep responses concise and professional
        7. Always respond in a helpful, friendly tone
        8. If unsure about medical advice, recommend consulting a healthcare professional
        
        User question: ${question}
        
        Please provide a helpful response following these guidelines.
      `;
    },
    showErrorFallback(question) {
      // First try to answer with local knowledge
      const localResponse = this.handleDirectQuestions(question) || 
                           this.handleProductSpecificQuestion(question);
      
      if (localResponse) {
        this.messages.push({
          type: 'bot',
          text: typeof localResponse === 'string' ? localResponse : localResponse.text,
          products: typeof localResponse === 'object' ? localResponse.products : []
        });
        return;
      }

      // If we can't answer locally, show a more helpful message
      this.messages.push({
        type: 'bot',
        text: "I can answer questions about our products, services, and general healthcare topics. " +
              "Here are some things you can ask me:<br><br>" +
              "- Tell me about [product name]<br>" +
              "- What's the price of [product]<br>" +
              "- Recommend products for [health concern]<br>" +
              "- What are your delivery options?<br>" +
              "- How do I contact support?",
        products: this.products.slice(0, 3) // Show some sample products
      });
    },
    handleProductSpecificQuestion(question) {
      const lowerQuestion = question.toLowerCase();
      
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
      
      return null;
    },
    generateUsageInstructions() {
      let response = `For <strong>${this.currentProduct.title}</strong>, the recommended usage is: `;
      
      if (this.currentProduct.category.includes('pharma') || this.currentProduct.category.includes('medicine')) {
        response += 'Take 1-2 capsules daily with water, or as directed by your physician.';
      } else if (this.currentProduct.category.includes('equipment')) {
        response += 'Please refer to the user manual for proper usage instructions.';
      } else {
        response += 'Follow the instructions on the product packaging.';
      }
      
      return response;
    },
    generateBenefits() {
      let response = `<strong>${this.currentProduct.title}</strong> can help with: `;
      
      if (this.currentProduct.category.includes('pain')) {
        response += 'relieving pain and inflammation.';
      } else if (this.currentProduct.category.includes('vitamin')) {
        response += 'boosting immunity and overall health.';
      } else if (this.currentProduct.category.includes('skin')) {
        response += 'improving skin health and appearance.';
      } else {
        response += 'various health benefits as described in the product details.';
      }
      
      return response;
    },
    generateSafetyInfo() {
      return `<strong>${this.currentProduct.title}</strong> is generally safe when used as directed. ` +
        'Some users may experience mild side effects. Consult your doctor if you have any concerns.';
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
          text: 'We offer standard delivery within 3-5 business days and express delivery within 2 hours (with additional fee).',
          products: []
        };
      }
      else if (lowerQuestion.includes('return') || lowerQuestion.includes('refund')) {
        return {
          text: 'We have a 30-day return policy for unopened products with original packaging. Please contact our support for returns.',
          products: []
        };
      }
      else if (lowerQuestion.includes('contact') || lowerQuestion.includes('support')) {
        return {
          text: 'You can reach our customer support at support@medicareplus.com or call us at +91 9876543210.',
          products: []
        };
      }
      else if (lowerQuestion.includes('product') || lowerQuestion.includes('item')) {
        return {
          text: 'Here are some of our popular healthcare products:',
          products: this.products.slice(0, 3)
        };
      }
      
      return null;
    },
    handleRecommendationRequest(question) {
      const keywords = ['pain', 'vitamin', 'skin', 'heart', 'diabetes', 'blood pressure', 'digest', 'immune', 'sleep', 'stress'];
      const matchedKeyword = keywords.find(keyword => question.includes(keyword));
      
      if (matchedKeyword) {
        const filteredProducts = this.products
          .filter(p => p.category.includes(matchedKeyword) || 
                      p.title.toLowerCase().includes(matchedKeyword) ||
                      p.description.toLowerCase().includes(matchedKeyword))
          .slice(0, 3);
        
        return {
          text: `Based on your interest in ${matchedKeyword}, here are some products you might find helpful:`,
          products: filteredProducts
        };
      } else {
        return {
          text: 'Here are some of our popular healthcare products:',
          products: this.products.slice(0, 3)
        };
      }
    },
    extractProductMentions(text) {
      const mentionedProducts = [];
      const productNames = this.products.map(p => p.title);
      
      productNames.forEach(name => {
        if (text.includes(name)) {
          const product = this.products.find(p => p.title === name);
          if (product) mentionedProducts.push(product);
        }
      });
      
      // Limit to 3 products maximum
      return mentionedProducts.slice(0, 3);
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
/* Your existing styles remain exactly the same */
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
</style>